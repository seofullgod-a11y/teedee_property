// server.js — TeeDee Property Platform
const express = require('express');
const path = require('path');
const crypto = require('crypto');
const { pool, migrate, seed } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'teedee1234';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

async function notifyTelegram(text) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: 'HTML' })
    });
  } catch (e) { console.error('telegram notify failed:', e.message); }
}
const tgEsc = (s) => String(s || '').replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]));

app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ---------- Helpers ----------
const adminToken = () =>
  crypto.createHmac('sha256', 'teedee-secret').update(ADMIN_PASSWORD).digest('hex');

function requireAdmin(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (token !== adminToken()) return res.status(401).json({ error: 'unauthorized' });
  next();
}

const SETTING_KEYS = ['site_name_main', 'site_name_accent', 'site_subtitle', 'logo_url'];
let settingsCache = null;
async function getSettings() {
  if (settingsCache) return settingsCache;
  const { rows } = await pool.query('SELECT key, value FROM settings');
  settingsCache = Object.fromEntries(rows.map(r => [r.key, r.value]));
  return settingsCache;
}
const brandName = (s) => `${s.site_name_main || 'อยู่'}${s.site_name_accent || 'ใจ'}`;

const LISTING_FIELDS = `id, title, listing_type, category, price, location_text, province,
  bedrooms, bathrooms, area_sqm, land_area_sqwah, floor_text, description, highlights,
  images, nearby, pets_allowed, featured, status, contact_line, contact_phone, views,
  created_at, updated_at`;

// ---------- Public API ----------

// GET /api/listings?type=rent&category=condo&q=พญาไท&min=10000&max=50000&beds=2&featured=1&sort=price_asc&page=1
app.get('/api/listings', async (req, res) => {
  try {
    const { type, category, q, min, max, beds, featured, sort, page, ids } = req.query;
    const where = [`status = 'active'`];
    const params = [];
    if (ids) {
      const arr = String(ids).split(',').map(Number).filter(n => Number.isInteger(n) && n > 0).slice(0, 60);
      if (!arr.length) return res.json({ total: 0, page: 1, limit: 24, items: [] });
      params.push(arr);
      where.push(`id = ANY($${params.length})`);
    }
    const add = (sql, val) => { params.push(val); where.push(sql.replace('?', `$${params.length}`)); };

    if (type && ['rent', 'sale'].includes(type)) add('listing_type = ?', type);
    if (category) add('category = ?', category);
    if (q) {
      params.push(`%${q}%`);
      const n = params.length;
      where.push(`(title ILIKE $${n} OR location_text ILIKE $${n} OR province ILIKE $${n} OR description ILIKE $${n})`);
    }
    if (min) add('price >= ?', Number(min) || 0);
    if (max) add('price <= ?', Number(max) || 999999999999);
    if (beds) add('bedrooms >= ?', Number(beds) || 0);
    if (featured === '1') where.push('featured = true');

    const sorts = {
      price_asc: 'price ASC', price_desc: 'price DESC',
      newest: 'created_at DESC', popular: 'views DESC'
    };
    const orderBy = sorts[sort] || 'featured DESC, created_at DESC';
    const limit = 24;
    const offset = (Math.max(1, Number(page) || 1) - 1) * limit;

    const sql = `SELECT ${LISTING_FIELDS}, COUNT(*) OVER()::int AS total
                 FROM listings WHERE ${where.join(' AND ')}
                 ORDER BY ${orderBy} LIMIT ${limit} OFFSET ${offset}`;
    const { rows } = await pool.query(sql, params);
    res.json({ total: rows[0]?.total || 0, page: Number(page) || 1, limit, items: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server error' });
  }
});

app.get('/api/listings/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'bad id' });
    await pool.query('UPDATE listings SET views = views + 1 WHERE id = $1', [id]);
    const { rows } = await pool.query(
      `SELECT ${LISTING_FIELDS} FROM listings WHERE id = $1 AND status = 'active'`, [id]);
    if (!rows[0]) return res.status(404).json({ error: 'not found' });

    const similar = await pool.query(
      `SELECT ${LISTING_FIELDS} FROM listings
       WHERE status='active' AND id != $1 AND (category = $2 OR listing_type = $3)
       ORDER BY featured DESC, created_at DESC LIMIT 3`,
      [id, rows[0].category, rows[0].listing_type]);
    res.json({ item: rows[0], similar: similar.rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server error' });
  }
});

app.get('/api/settings', async (req, res) => {
  try {
    const s = await getSettings();
    res.json(Object.fromEntries(SETTING_KEYS.map(k => [k, s[k] || ''])));
  } catch (e) { res.status(500).json({ error: 'server error' }); }
});

app.post('/api/inquiries', async (req, res) => {
  try {
    const { listing_id, name, phone, line_id, message } = req.body || {};
    if (!name || (!phone && !line_id))
      return res.status(400).json({ error: 'กรุณากรอกชื่อ และเบอร์โทรหรือ LINE ID' });
    await pool.query(
      `INSERT INTO inquiries (listing_id, name, phone, line_id, message)
       VALUES ($1,$2,$3,$4,$5)`,
      [listing_id || null, String(name).slice(0, 120), String(phone || '').slice(0, 40),
       String(line_id || '').slice(0, 80), String(message || '').slice(0, 2000)]);
    res.json({ ok: true });

    // แจ้งเตือน Telegram แบบ fire-and-forget (ไม่บล็อก response)
    (async () => {
      let listingLine = '';
      if (listing_id) {
        const { rows } = await pool.query('SELECT title FROM listings WHERE id = $1', [Number(listing_id)]).catch(() => ({ rows: [] }));
        if (rows[0]) listingLine = `\n🏠 ประกาศ: ${tgEsc(rows[0].title)} (#${listing_id})`;
      }
      const bn = brandName(await getSettings().catch(() => ({})));
      notifyTelegram(
        `📩 <b>ข้อความติดต่อใหม่ — ${bn}</b>${listingLine}\n` +
        `👤 ${tgEsc(name)}\n` +
        (phone ? `📞 ${tgEsc(phone)}\n` : '') +
        (line_id ? `💬 LINE: ${tgEsc(line_id)}\n` : '') +
        (message ? `📝 ${tgEsc(String(message).slice(0, 500))}` : '')
      );
    })().catch(() => {});
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server error' });
  }
});

// ทำเลยอดนิยม (จังหวัด + จำนวนประกาศ)
app.get('/api/meta/provinces', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT province, COUNT(*)::int AS count FROM listings
       WHERE status = 'active' AND province <> ''
       GROUP BY province ORDER BY count DESC, province LIMIT 8`);
    res.json({ items: rows });
  } catch (e) { res.status(500).json({ error: 'server error' }); }
});

// ---------- Admin API ----------

app.post('/api/admin/login', (req, res) => {
  if ((req.body?.password || '') === ADMIN_PASSWORD) return res.json({ token: adminToken() });
  res.status(401).json({ error: 'รหัสผ่านไม่ถูกต้อง' });
});

app.get('/api/admin/stats', requireAdmin, async (req, res) => {
  const [l, i, v] = await Promise.all([
    pool.query(`SELECT status, COUNT(*)::int c FROM listings GROUP BY status`),
    pool.query(`SELECT COUNT(*)::int c, COUNT(*) FILTER (WHERE NOT is_read)::int unread FROM inquiries`),
    pool.query(`SELECT COALESCE(SUM(views),0)::int v FROM listings`)
  ]);
  const byStatus = Object.fromEntries(l.rows.map(r => [r.status, r.c]));
  res.json({
    active: byStatus.active || 0, draft: byStatus.draft || 0, closed: byStatus.closed || 0,
    inquiries: i.rows[0].c, unread: i.rows[0].unread, views: v.rows[0].v
  });
});

app.get('/api/admin/listings', requireAdmin, async (req, res) => {
  const { rows } = await pool.query(
    `SELECT ${LISTING_FIELDS} FROM listings ORDER BY updated_at DESC LIMIT 500`);
  res.json({ items: rows });
});

function listingParams(b) {
  return [
    String(b.title || '').slice(0, 300),
    ['rent', 'sale'].includes(b.listing_type) ? b.listing_type : 'rent',
    ['house', 'condo', 'townhouse', 'land', 'commercial'].includes(b.category) ? b.category : 'condo',
    Number(b.price) || 0,
    String(b.location_text || '').slice(0, 200),
    String(b.province || '').slice(0, 100),
    Number(b.bedrooms) || 0,
    Number(b.bathrooms) || 0,
    Number(b.area_sqm) || 0,
    Number(b.land_area_sqwah) || 0,
    String(b.floor_text || '').slice(0, 40),
    String(b.description || '').slice(0, 8000),
    JSON.stringify(Array.isArray(b.highlights) ? b.highlights.slice(0, 12) : []),
    JSON.stringify(Array.isArray(b.images) ? b.images.slice(0, 20) : []),
    JSON.stringify(Array.isArray(b.nearby) ? b.nearby.slice(0, 12) : []),
    !!b.pets_allowed,
    !!b.featured,
    ['active', 'draft', 'closed'].includes(b.status) ? b.status : 'draft',
    String(b.contact_line || '').slice(0, 80),
    String(b.contact_phone || '').slice(0, 40)
  ];
}

app.post('/api/admin/listings', requireAdmin, async (req, res) => {
  try {
    const p = listingParams(req.body || {});
    if (!p[0]) return res.status(400).json({ error: 'กรุณากรอกชื่อประกาศ' });
    const { rows } = await pool.query(
      `INSERT INTO listings (title, listing_type, category, price, location_text, province,
        bedrooms, bathrooms, area_sqm, land_area_sqwah, floor_text, description, highlights,
        images, nearby, pets_allowed, featured, status, contact_line, contact_phone)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
       RETURNING id`, p);
    res.json({ ok: true, id: rows[0].id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server error' });
  }
});

app.put('/api/admin/listings/:id', requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const p = listingParams(req.body || {});
    await pool.query(
      `UPDATE listings SET title=$1, listing_type=$2, category=$3, price=$4, location_text=$5,
        province=$6, bedrooms=$7, bathrooms=$8, area_sqm=$9, land_area_sqwah=$10, floor_text=$11,
        description=$12, highlights=$13, images=$14, nearby=$15, pets_allowed=$16, featured=$17,
        status=$18, contact_line=$19, contact_phone=$20, updated_at=now()
       WHERE id=$21`, [...p, id]);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server error' });
  }
});

app.delete('/api/admin/listings/:id', requireAdmin, async (req, res) => {
  await pool.query('DELETE FROM listings WHERE id = $1', [Number(req.params.id)]);
  res.json({ ok: true });
});

app.post('/api/admin/upload-logo', requireAdmin, async (req, res) => {
  try {
    const dataUrl = String(req.body?.dataUrl || '');
    const m = dataUrl.match(/^data:image\/(png|jpeg|jpg|webp|svg\+xml);base64,([A-Za-z0-9+/=]+)$/);
    if (!m) return res.status(400).json({ error: 'ไฟล์ไม่ถูกต้อง (รองรับ PNG, JPG, WEBP, SVG)' });
    // จำกัดขนาด ~1.5MB (base64 ยาวกว่าไฟล์จริง ~33%)
    if (dataUrl.length > 2_000_000) return res.status(400).json({ error: 'ไฟล์ใหญ่เกินไป (ไม่เกิน ~1.5MB)' });
    await pool.query(
      `INSERT INTO settings (key, value) VALUES ('logo_url', $1)
       ON CONFLICT (key) DO UPDATE SET value = $1`, [dataUrl]);
    settingsCache = null;
    res.json({ ok: true, logo_url: dataUrl });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server error' });
  }
});

app.put('/api/admin/settings', requireAdmin, async (req, res) => {
  try {
    const body = req.body || {};
    for (const k of SETTING_KEYS) {
      if (k in body) {
        await pool.query(
          `INSERT INTO settings (key, value) VALUES ($1, $2)
           ON CONFLICT (key) DO UPDATE SET value = $2`,
          [k, String(body[k] || '').slice(0, 500)]);
      }
    }
    settingsCache = null;
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server error' });
  }
});

// คัดลอกประกาศ (สร้างสำเนาเป็นฉบับร่าง)
app.post('/api/admin/listings/:id/duplicate', requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `INSERT INTO listings (title, listing_type, category, price, location_text, province,
        bedrooms, bathrooms, area_sqm, land_area_sqwah, floor_text, description, highlights,
        images, nearby, pets_allowed, featured, status, contact_line, contact_phone)
       SELECT title || ' (สำเนา)', listing_type, category, price, location_text, province,
        bedrooms, bathrooms, area_sqm, land_area_sqwah, floor_text, description, highlights,
        images, nearby, pets_allowed, false, 'draft', contact_line, contact_phone
       FROM listings WHERE id = $1 RETURNING id`, [Number(req.params.id)]);
    if (!rows[0]) return res.status(404).json({ error: 'not found' });
    res.json({ ok: true, id: rows[0].id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server error' });
  }
});

// สลับสถานะเร็ว (เผยแพร่ <-> ปิด)
app.patch('/api/admin/listings/:id/status', requireAdmin, async (req, res) => {
  const st = req.body?.status;
  if (!['active', 'draft', 'closed'].includes(st)) return res.status(400).json({ error: 'bad status' });
  await pool.query('UPDATE listings SET status = $1, updated_at = now() WHERE id = $2',
    [st, Number(req.params.id)]);
  res.json({ ok: true });
});

app.get('/api/admin/inquiries', requireAdmin, async (req, res) => {
  const { rows } = await pool.query(
    `SELECT q.*, l.title AS listing_title FROM inquiries q
     LEFT JOIN listings l ON l.id = q.listing_id
     ORDER BY q.created_at DESC LIMIT 300`);
  res.json({ items: rows });
});

app.put('/api/admin/inquiries/:id/read', requireAdmin, async (req, res) => {
  await pool.query('UPDATE inquiries SET is_read = true WHERE id = $1', [Number(req.params.id)]);
  res.json({ ok: true });
});

// ---------- AI Content Assistant ----------
// mode: description | title | highlights | social
app.post('/api/admin/ai/generate', requireAdmin, async (req, res) => {
  try {
    if (!ANTHROPIC_API_KEY)
      return res.status(400).json({ error: 'ยังไม่ได้ตั้งค่า ANTHROPIC_API_KEY ใน Railway Variables' });

    const { mode, data } = req.body || {};
    const d = data || {};
    const typeTh = d.listing_type === 'sale' ? 'ขาย' : 'เช่า';
    const catTh = { house: 'บ้านเดี่ยว', condo: 'คอนโด', townhouse: 'ทาวน์เฮาส์/ทาวน์โฮม', land: 'ที่ดิน', commercial: 'อาคารพาณิชย์' }[d.category] || 'อสังหาริมทรัพย์';

    const facts = [
      `ประเภท: ${catTh} (${typeTh})`,
      d.title && `ชื่อประกาศปัจจุบัน: ${d.title}`,
      d.price && `ราคา: ${Number(d.price).toLocaleString()} บาท${d.listing_type === 'rent' ? '/เดือน' : ''}`,
      d.location_text && `ทำเล: ${d.location_text}`,
      d.bedrooms > 0 && `ห้องนอน: ${d.bedrooms}`,
      d.bathrooms > 0 && `ห้องน้ำ: ${d.bathrooms}`,
      d.area_sqm > 0 && `พื้นที่ใช้สอย: ${d.area_sqm} ตร.ม.`,
      d.land_area_sqwah > 0 && `ที่ดิน: ${d.land_area_sqwah} ตร.ว.`,
      d.floor_text && `ชั้น: ${d.floor_text}`,
      d.nearby?.length && `สถานที่ใกล้เคียง: ${d.nearby.map(n => `${n.label} (${n.dist})`).join(', ')}`,
      d.pets_allowed && 'เลี้ยงสัตว์ได้',
      d.notes && `ข้อมูลเพิ่มเติมจากแอดมิน: ${d.notes}`
    ].filter(Boolean).join('\n');

    const prompts = {
      description:
        `เขียนคำอธิบายประกาศอสังหาริมทรัพย์ภาษาไทย ความยาว 3-5 ประโยค น่าอ่าน จริงใจ ไม่โอเวอร์ เน้นจุดเด่นของทำเลและการใช้ชีวิตจริง ห้ามแต่งข้อมูลที่ไม่มีในโจทย์ ตอบเฉพาะเนื้อหา ไม่ต้องมีหัวข้อ:\n\n${facts}`,
      title:
        `คิดชื่อประกาศอสังหาริมทรัพย์ภาษาไทย 5 แบบ สั้น กระชับ ติดหู มีทำเลหรือจุดขายหลัก ตอบเป็น JSON array ของ string เท่านั้น เช่น ["...","..."] ห้ามมีข้อความอื่น:\n\n${facts}`,
      highlights:
        `สรุปจุดเด่น 4-6 ข้อของประกาศนี้ ข้อละไม่เกิน 6 คำ ภาษาไทย ตอบเป็น JSON array ของ string เท่านั้น ห้ามมีข้อความอื่น:\n\n${facts}`,
      social:
        `เขียนแคปชันโพสต์ Facebook/LINE สำหรับประกาศอสังหานี้ ภาษาไทย มี emoji พอดี ๆ มี bullet จุดเด่น 3-4 ข้อ ปิดท้ายชวนทักแชท ตอบเฉพาะแคปชัน:\n\n${facts}`
    };

    const prompt = prompts[mode] || prompts.description;

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const out = await r.json();
    if (!r.ok) {
      console.error('Anthropic API error:', out);
      return res.status(502).json({ error: out?.error?.message || 'AI service error' });
    }
    let text = (out.content || []).filter(c => c.type === 'text').map(c => c.text).join('\n').trim();

    if (mode === 'title' || mode === 'highlights') {
      try {
        const clean = text.replace(/```json|```/g, '').trim();
        const arr = JSON.parse(clean);
        return res.json({ result: arr });
      } catch { /* fall through: return raw text */ }
    }
    res.json({ result: text });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server error' });
  }
});

// ---------- Pages ----------
const fs = require('fs');
const listingTpl = fs.readFileSync(path.join(__dirname, 'public/listing.html'), 'utf8');
const htmlEsc = (s) => String(s || '').replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
const baseUrl = (req) => process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;

app.get('/listing/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const { rows } = await pool.query(
      `SELECT title, description, images, price, listing_type FROM listings WHERE id = $1 AND status = 'active'`, [id]);
    if (rows[0]) {
      const l = rows[0];
      const priceTxt = l.listing_type === 'rent'
        ? `฿${Number(l.price).toLocaleString('th-TH')}/เดือน`
        : `฿${Number(l.price).toLocaleString('th-TH')}`;
      const title = `${htmlEsc(l.title)} · ${priceTxt} — ${htmlEsc(brandName(await getSettings().catch(() => ({}))))}`;
      const desc = htmlEsc(String(l.description || '').slice(0, 160));
      const img = htmlEsc((l.images || [])[0] || '');
      const og = `<title>${title}</title>
  <meta name="description" content="${desc}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  ${img ? `<meta property="og:image" content="${img}">` : ''}
  <meta property="og:url" content="${baseUrl(req)}/listing/${id}">
  <meta name="twitter:card" content="summary_large_image">`;
      return res.send(listingTpl.replace(/<title>[^<]*<\/title>/, og));
    }
  } catch (e) { console.error(e); }
  res.send(listingTpl);
});

app.get('/sitemap.xml', async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT id, updated_at FROM listings WHERE status = 'active' ORDER BY id`);
    const base = baseUrl(req);
    const urls = [
      `<url><loc>${base}/</loc></url>`,
      `<url><loc>${base}/search</loc></url>`,
      ...rows.map(r => `<url><loc>${base}/listing/${r.id}</loc><lastmod>${new Date(r.updated_at).toISOString().slice(0, 10)}</lastmod></url>`)
    ].join('');
    res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
  } catch (e) { res.status(500).send(''); }
});

app.get('/robots.txt', (req, res) =>
  res.type('text/plain').send(`User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ${baseUrl(req)}/sitemap.xml`));

app.get('/saved', (req, res) => res.sendFile(path.join(__dirname, 'public/saved.html')));
app.get('/search', (req, res) => res.sendFile(path.join(__dirname, 'public/listings.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public/admin.html')));
app.get('/healthz', (req, res) => res.json({ ok: true }));

// ---------- Boot ----------
(async () => {
  try {
    await migrate();
    await seed();
    app.listen(PORT, () => console.log(`TeeDee running on :${PORT}`));
  } catch (e) {
    console.error('Boot failed:', e);
    process.exit(1);
  }
})();
