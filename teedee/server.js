// server.js — TeeDee Property Platform
const express = require('express');
const path = require('path');
const crypto = require('crypto');
const { pool, migrate, seed, PROV_COORD, SEED } = require('./db');
const seo = require('./seo');

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
// บันทึก event สำหรับ analytics แบบ fire-and-forget (ไม่บล็อก response)
function logEvent(type, ref, meta) {
  pool.query('INSERT INTO events (type, ref, meta) VALUES ($1,$2,$3)',
    [String(type).slice(0, 40), String(ref || '').slice(0, 200), JSON.stringify(meta || {})])
    .catch(() => {});
}
// อีเมลแจ้งเตือนเจ้าของ (ทำงานเมื่อกำหนด SMTP_* env เท่านั้น มิฉะนั้นข้ามไปเงียบ ๆ)
let _mailer = null, _mailerTried = false;
function getMailer() {
  if (_mailerTried) return _mailer;
  _mailerTried = true;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  try {
    const nodemailer = require('nodemailer');
    _mailer = nodemailer.createTransport({
      host: SMTP_HOST, port: Number(SMTP_PORT) || 587,
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS }
    });
  } catch (e) { console.error('mailer init failed:', e.message); _mailer = null; }
  return _mailer;
}
function sendEmail(subject, text) {
  const mailer = getMailer();
  const to = process.env.NOTIFY_EMAIL || process.env.SMTP_USER;
  if (!mailer || !to) return;
  mailer.sendMail({
    from: process.env.SMTP_FROM || `"อยู่ใจ" <${process.env.SMTP_USER}>`,
    to, subject, text
  }).catch(e => console.error('email send failed:', e.message));
}
// แจ้งเตือนเจ้าของทั้ง Telegram + อีเมล (ถ้าตั้งค่าไว้)
function notifyOwner(subject, body) {
  notifyTelegram(body);
  sendEmail(subject, body.replace(/<\/?b>/g, ''));
}
const tgEsc = (s) => String(s || '').replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]));

app.use(express.json({ limit: '6mb' }));
app.use(express.static(path.join(__dirname, 'public'), {
  index: false,
  maxAge: '7d',
  setHeaders(res, filePath) {
    // ไฟล์ที่มี ?v= จะถูก cache นานอยู่แล้ว; ตั้ง cache ปานกลางสำหรับ asset ทั่วไป
    if (/\.(css|js|png|jpg|jpeg|webp|svg|woff2?)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=604800');
    }
  }
}));

// ---------- Helpers ----------
const adminToken = () =>
  crypto.createHmac('sha256', 'teedee-secret').update(ADMIN_PASSWORD).digest('hex');

function requireAdmin(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (token !== adminToken()) return res.status(401).json({ error: 'unauthorized' });
  next();
}

// ---------- User auth (scrypt + HMAC cookie session) ----------
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.createHash('sha256').update('yj-sess-' + (ADMIN_PASSWORD || 'x')).digest('hex');
function hashPassword(pw) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(String(pw), salt, 64).toString('hex');
  return `${salt}:${hash}`;
}
function verifyPassword(pw, stored) {
  const [salt, hash] = String(stored || '').split(':');
  if (!salt || !hash) return false;
  const test = crypto.scryptSync(String(pw), salt, 64).toString('hex');
  const a = Buffer.from(hash, 'hex'), b = Buffer.from(test, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
function signSession(uid) {
  const exp = Date.now() + 30 * 864e5; // 30 วัน
  const body = `${uid}.${exp}`;
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(body).digest('hex');
  return `${body}.${sig}`;
}
function verifySession(token) {
  if (!token) return null;
  const parts = String(token).split('.');
  if (parts.length !== 3) return null;
  const [uid, exp, sig] = parts;
  const good = crypto.createHmac('sha256', SESSION_SECRET).update(`${uid}.${exp}`).digest('hex');
  if (sig.length !== good.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(good))) return null;
  if (Number(exp) < Date.now()) return null;
  return Number(uid);
}
function parseCookies(req) {
  const out = {};
  (req.headers.cookie || '').split(';').forEach(c => {
    const i = c.indexOf('=');
    if (i > -1) out[c.slice(0, i).trim()] = decodeURIComponent(c.slice(i + 1).trim());
  });
  return out;
}
function currentUser(req) {
  return verifySession(parseCookies(req).yj_session);
}
function setSessionCookie(res, uid) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `yj_session=${signSession(uid)}; HttpOnly; Path=/; Max-Age=${30 * 86400}; SameSite=Lax${secure}`);
}

const SETTING_KEYS = ['site_name_main', 'site_name_accent', 'site_subtitle', 'logo_url', 'logo_url_dark'];
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
  latitude, longitude, amenities, furnishings, common_fee_text, year_built, badge, verified, agent_id, created_at, updated_at`;

// ---------- Public API ----------

// GET /api/listings?type=rent&category=condo&q=พญาไท&min=10000&max=50000&beds=2&featured=1&sort=price_asc&page=1
app.get('/api/listings', async (req, res) => {
  try {
    const { type, category, q, min, max, beds, baths, pets, province, featured, sort, page, ids } = req.query;
    const where = [`l.status = 'active'`];
    const params = [];
    if (ids) {
      const arr = String(ids).split(',').map(Number).filter(n => Number.isInteger(n) && n > 0).slice(0, 60);
      if (!arr.length) return res.json({ total: 0, page: 1, limit: 24, items: [] });
      params.push(arr);
      where.push(`l.id = ANY($${params.length})`);
    }
    const add = (sql, val) => { params.push(val); where.push(sql.replace('?', `$${params.length}`)); };

    if (type && ['rent', 'sale'].includes(type)) add('l.listing_type = ?', type);
    if (category) add('l.category = ?', category);
    if (q) {
      params.push(`%${q}%`);
      const n = params.length;
      where.push(`(l.title ILIKE $${n} OR l.location_text ILIKE $${n} OR l.province ILIKE $${n} OR l.description ILIKE $${n})`);
    }
    if (min) add('l.price >= ?', Number(min) || 0);
    if (max) add('l.price <= ?', Number(max) || 999999999999);
    if (beds) add('l.bedrooms >= ?', Number(beds) || 0);
    if (baths) add('l.bathrooms >= ?', Number(baths) || 0);
    if (pets === '1') where.push('l.pets_allowed = true');
    if (province) add('l.province = ?', String(province).slice(0, 80));
    if (featured === '1') where.push('l.featured = true');

    const sorts = {
      price_asc: 'l.price ASC', price_desc: 'l.price DESC',
      newest: 'l.created_at DESC', popular: 'l.views DESC',
      rating: 'rating_avg DESC NULLS LAST, rating_count DESC'
    };
    const orderBy = sorts[sort] || 'l.featured DESC, l.created_at DESC';
    const limit = 24;
    const offset = (Math.max(1, Number(page) || 1) - 1) * limit;

    const RATING_SUB = `(SELECT ROUND(AVG(rating)::numeric,1) FROM listing_reviews WHERE listing_id=l.id AND approved) AS rating_avg,
                        (SELECT COUNT(*)::int FROM listing_reviews WHERE listing_id=l.id AND approved) AS rating_count`;
    const sql = `SELECT ${LISTING_FIELDS}, ${RATING_SUB}, COUNT(*) OVER()::int AS total
                 FROM listings l WHERE ${where.join(' AND ')}
                 ORDER BY ${orderBy} LIMIT ${limit} OFFSET ${offset}`;
    const { rows } = await pool.query(sql, params);
    if (q && String(q).trim().length >= 2 && !ids) logEvent('search', String(q).trim(), { type: type || '', category: category || '', results: rows[0]?.total || 0 });
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
    logEvent('view', String(id), { province: rows[0].province, category: rows[0].category });

    // ผู้ดูแลทรัพย์ (agent)
    let agent = null;
    if (rows[0].agent_id) {
      const a = await pool.query('SELECT id, name, role, phone, line_id, photo_url, bio FROM agents WHERE id=$1 AND active', [rows[0].agent_id]);
      agent = a.rows[0] || null;
    }

    const similar = await pool.query(
      `SELECT ${LISTING_FIELDS} FROM listings
       WHERE status='active' AND id != $1 AND (category = $2 OR listing_type = $3)
       ORDER BY featured DESC, created_at DESC LIMIT 3`,
      [id, rows[0].category, rows[0].listing_type]);
    res.json({ item: rows[0], similar: similar.rows, agent });
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
    const { listing_id, name, phone, line_id, message, website } = req.body || {};
    // honeypot: บอทมักกรอกช่องซ่อน "website" — ถ้ามีค่าถือว่าเป็นสแปม (ตอบ ok หลอกไว้)
    if (website) return res.json({ ok: true });
    // rate limit ต่อ IP
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.ip || 'x';
    const now = Date.now(); const h = inquiryHits.get(ip) || { c: 0, t: now };
    if (now - h.t > 3600e3) { h.c = 0; h.t = now; }
    if (h.c >= 12) return res.status(429).json({ error: 'ส่งข้อความบ่อยเกินไป กรุณาลองใหม่ภายหลัง' });
    if (!name || (!phone && !line_id))
      return res.status(400).json({ error: 'กรุณากรอกชื่อ และเบอร์โทรหรือ LINE ID' });
    h.c++; inquiryHits.set(ip, h);
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
      notifyOwner(
        `ข้อความติดต่อใหม่ — ${bn}`,
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

// ประกาศอื่นในทำเลเดียวกัน (จังหวัดตรงกัน ไม่รวมประกาศปัจจุบัน)
app.get('/api/listings-in-area', async (req, res) => {
  try {
    const province = String(req.query.province || '').slice(0, 80);
    const exclude = Number(req.query.exclude) || 0;
    if (!province) return res.json({ items: [] });
    const { rows } = await pool.query(
      `SELECT ${LISTING_FIELDS} FROM listings
       WHERE status='active' AND province = $1 AND id <> $2
       ORDER BY featured DESC, created_at DESC LIMIT 6`, [province, exclude]);
    res.json({ items: rows });
  } catch (e) { console.error(e); res.status(500).json({ error: 'server error' }); }
});

// AI วิเคราะห์ย่าน (แคชต่อจังหวัด — สร้างครั้งเดียวแล้วใช้ซ้ำ ประหยัด API)
const areaInsightFallback = (province, cats) => {
  const has = (c) => cats.includes(c);
  const kinds = [];
  if (has('condo')) kinds.push('คอนโด');
  if (has('house')) kinds.push('บ้านเดี่ยว');
  if (has('townhouse')) kinds.push('ทาวน์เฮาส์');
  if (has('land')) kinds.push('ที่ดิน');
  const kindTxt = kinds.length ? `มีทั้ง${kinds.join(' ')}ให้เลือก ` : '';
  return `${province}เป็นทำเลที่มีอสังหาริมทรัพย์หลากหลายให้เลือก ${kindTxt}เหมาะทั้งอยู่อาศัยเองและลงทุนปล่อยเช่า — ดูประกาศทั้งหมดในย่านนี้เพื่อเปรียบเทียบราคาและทำเลได้เลย`;
};

app.get('/api/area-insight', async (req, res) => {
  try {
    const province = String(req.query.province || '').slice(0, 80).trim();
    if (!province) return res.json({ insight: '', cached: false });

    const cached = await pool.query('SELECT insight FROM area_insights WHERE province = $1', [province]);
    if (cached.rows[0]?.insight) return res.json({ insight: cached.rows[0].insight, cached: true });

    // รวมหมวดที่มีในจังหวัด (ไว้ใช้ทั้ง AI และ fallback)
    const catRows = await pool.query(
      `SELECT DISTINCT category FROM listings WHERE status='active' AND province = $1`, [province]);
    const cats = catRows.rows.map(r => r.category);

    if (!ANTHROPIC_API_KEY) return res.json({ insight: areaInsightFallback(province, cats), cached: false });

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 260,
        system: 'คุณคือผู้เชี่ยวชาญอสังหาริมทรัพย์ไทย เขียนบทวิเคราะห์ย่านแบบสั้น กระชับ เป็นกลาง เพื่อช่วยผู้ซื้อ/เช่าตัดสินใจ',
        messages: [{
          role: 'user',
          content: `เขียนบทวิเคราะห์ทำเล "${province}" สำหรับคนกำลังหาที่อยู่ ความยาว 2-3 ประโยค ครอบคลุม: บรรยากาศ/จุดเด่นของย่าน, เหมาะกับใคร (ครอบครัว/คนทำงาน/นักลงทุน), และภาพรวมการใช้ชีวิต โทนกลาง ๆ ไม่โฆษณาเกินจริง ไม่ต้องขึ้นหัวข้อ ตอบเป็นภาษาไทยล้วน` }]
      })
    });
    const out = await r.json();
    if (!r.ok) { console.error('area-insight AI error:', out?.error?.message); return res.json({ insight: areaInsightFallback(province, cats), cached: false }); }
    const text = (out.content || []).filter(c => c.type === 'text').map(c => c.text).join('\n').trim();
    if (text) {
      await pool.query(
        `INSERT INTO area_insights (province, insight) VALUES ($1,$2)
         ON CONFLICT (province) DO UPDATE SET insight = EXCLUDED.insight, created_at = now()`,
        [province, text.slice(0, 1200)]).catch(() => {});
      return res.json({ insight: text, cached: false });
    }
    res.json({ insight: areaInsightFallback(province, cats), cached: false });
  } catch (e) { console.error(e); res.json({ insight: '', cached: false }); }
});

// ---------- Admin API ----------

// ============ Saved Searches (แจ้งเตือนทรัพย์ตรงใจ) ============
function matchesCriteria(l, c) {
  c = c || {};
  if (c.type && l.listing_type !== c.type) return false;
  if (c.category && l.category !== c.category) return false;
  if (c.province && !(l.province || '').includes(c.province)) return false;
  if (c.q) {
    const hay = `${l.title} ${l.location_text} ${l.province} ${l.description}`.toLowerCase();
    if (!hay.includes(String(c.q).toLowerCase())) return false;
  }
  const price = Number(l.price) || 0;
  if (c.min != null && c.min !== '' && price < Number(c.min)) return false;
  if (c.max != null && c.max !== '' && price > Number(c.max)) return false;
  if (c.beds != null && c.beds !== '' && (Number(l.bedrooms) || 0) < Number(c.beds)) return false;
  return true;
}

// สร้างการแจ้งเตือน (สาธารณะ)
app.post('/api/saved-searches', async (req, res) => {
  try {
    const b = req.body || {};
    const contact = String(b.contact || '').trim().slice(0, 120);
    if (!contact) return res.status(400).json({ error: 'กรุณากรอกช่องทางติดต่อ (LINE / อีเมล / เบอร์)' });
    const channel = ['line', 'email', 'phone'].includes(b.channel) ? b.channel : 'line';
    const criteria = {
      q: String(b.q || '').trim().slice(0, 120),
      type: ['rent', 'sale'].includes(b.type) ? b.type : '',
      category: ['condo', 'house', 'townhouse', 'land', 'commercial'].includes(b.category) ? b.category : '',
      province: String(b.province || '').trim().slice(0, 80),
      min: b.min === '' || b.min == null ? '' : Number(b.min) || '',
      max: b.max === '' || b.max == null ? '' : Number(b.max) || '',
      beds: b.beds === '' || b.beds == null ? '' : Number(b.beds) || ''
    };
    const label = String(b.label || '').trim().slice(0, 140);
    const { rows } = await pool.query(
      `INSERT INTO saved_searches (label, criteria, channel, contact) VALUES ($1,$2,$3,$4) RETURNING id`,
      [label, JSON.stringify(criteria), channel, contact]);
    notifyTelegram(`🔔 <b>มีคนตั้งการแจ้งเตือนใหม่</b>\n${label || '(ไม่ระบุ)'}\nติดต่อ: ${channel} ${contact}`);
    res.json({ ok: true, id: rows[0].id });
  } catch (e) { console.error(e); res.status(500).json({ error: 'server error' }); }
});

// จับคู่ทรัพย์ใหม่กับการแจ้งเตือนที่บันทึกไว้ (เรียกหลังสร้างประกาศ)
async function runSavedSearchMatch(listingId) {
  try {
    const lr = await pool.query(`SELECT ${LISTING_FIELDS} FROM listings WHERE id = $1`, [listingId]);
    const l = lr.rows[0];
    if (!l || l.status !== 'active') return 0;
    const ss = await pool.query(`SELECT id, label, criteria, channel, contact FROM saved_searches WHERE active = true`);
    const hits = [];
    for (const s of ss.rows) {
      const crit = typeof s.criteria === 'string' ? JSON.parse(s.criteria) : s.criteria;
      if (!matchesCriteria(l, crit)) continue;
      const ins = await pool.query(
        `INSERT INTO search_matches (search_id, listing_id) VALUES ($1,$2)
         ON CONFLICT DO NOTHING RETURNING search_id`, [s.id, listingId]);
      if (ins.rows[0]) hits.push(s);
    }
    if (hits.length) {
      const who = hits.map(h => `• ${h.channel} ${h.contact}`).join('\n');
      notifyTelegram(`🔔 <b>ทรัพย์ใหม่ตรงกับ ${hits.length} การแจ้งเตือน</b>\n“${l.title}”\n${BASE_URL}/listing/${l.id}\n\nติดต่อลูกค้าเหล่านี้ได้เลย:\n${who}`);
    }
    return hits.length;
  } catch (e) { console.error('saved-search match error:', e); return 0; }
}

// ดึงหลายประกาศตาม id (สำหรับหน้าเปรียบเทียบ — ไม่นับ views)
app.get('/api/listings-by-ids', async (req, res) => {
  try {
    const ids = String(req.query.ids || '').split(',').map(n => Number(n)).filter(Boolean).slice(0, 4);
    if (!ids.length) return res.json({ items: [] });
    const { rows } = await pool.query(
      `SELECT ${LISTING_FIELDS} FROM listings WHERE id = ANY($1) AND status = 'active'`, [ids]);
    const order = new Map(ids.map((id, i) => [id, i]));
    rows.sort((a, b) => order.get(a.id) - order.get(b.id));
    res.json({ items: rows });
  } catch (e) { console.error(e); res.status(500).json({ error: 'server error' }); }
});

// ============ Map search: markers เบา ๆ ============
app.get('/api/map-listings', async (req, res) => {
  try {
    const where = [`status='active'`, `latitude IS NOT NULL`, `longitude IS NOT NULL`];
    const args = [];
    const add = (col, op, val) => { args.push(val); where.push(`${col}${op}$${args.length}`); };
    if (['rent', 'sale'].includes(req.query.type)) add('listing_type', '=', req.query.type);
    if (['condo', 'house', 'townhouse', 'land', 'commercial'].includes(req.query.category)) add('category', '=', req.query.category);
    if (req.query.min) add('price', '>=', Number(req.query.min) || 0);
    if (req.query.max) add('price', '<=', Number(req.query.max) || 0);
    if (req.query.beds) add('bedrooms', '>=', Number(req.query.beds) || 0);
    if (req.query.q) {
      args.push('%' + String(req.query.q).slice(0, 60) + '%');
      const p = '$' + args.length;
      where.push(`(title ILIKE ${p} OR location_text ILIKE ${p} OR province ILIKE ${p})`);
    }
    const { rows } = await pool.query(
      `SELECT id, title, price, listing_type, category, latitude, longitude,
              bedrooms, bathrooms, area_sqm, location_text, (images->>0) AS image
       FROM listings WHERE ${where.join(' AND ')} LIMIT 400`, args);
    res.json({ items: rows });
  } catch (e) { console.error('map-listings:', e.message); res.status(500).json({ error: 'server error' }); }
});

// ============ AI Concierge: คุยแล้วคัดทรัพย์ให้ ============
async function conciergeFilters(q) {
  if (!ANTHROPIC_API_KEY) return null;
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL, max_tokens: 350,
      system: 'คุณคือผู้ช่วยหาบ้านมืออาชีพของเว็บ "อยู่ใจ" พูดจาเป็นกันเองแต่สุภาพ ตอบสั้นกระชับ',
      messages: [{
        role: 'user',
        content: `ผู้ใช้พิมพ์ว่า: "${q}"\n\nตอบเป็น JSON เท่านั้น ห้ามมีข้อความอื่น:\n{"reply":"ข้อความตอบผู้ใช้ 1-2 ประโยค เป็นกันเอง สรุปว่ากำลังหาอะไรให้","filters":{"type":"rent"|"sale"|null,"category":"condo"|"house"|"townhouse"|"land"|"commercial"|null,"min":number|null,"max":number|null,"beds":number|null,"q":"คีย์เวิร์ดทำเล/สถานที่ หรือว่าง"}}\n\nกติกา: เช่า=rent ซื้อ/ขาย=sale, หมื่น=10000 แสน=100000 ล้าน=1000000, "ไม่เกิน X"=max, เอาเฉพาะชื่อทำเล/สถานที่ลง q`
      }]
    })
  });
  const out = await r.json();
  if (!r.ok) return null;
  const text = (out.content || []).filter(c => c.type === 'text').map(c => c.text).join('').replace(/```json|```/g, '').trim();
  return JSON.parse(text);
}

app.post('/api/concierge', async (req, res) => {
  try {
    const q = String(req.body?.message || '').slice(0, 300).trim();
    if (q.length < 2) return res.json({ reply: 'ลองพิมพ์บอกความต้องการได้เลยครับ เช่น "คอนโดเช่าใกล้ BTS งบ 2 หมื่น"', items: [] });

    let parsed = null;
    try { parsed = await conciergeFilters(q); } catch (e) { console.error('concierge ai:', e.message); }

    const f = (parsed && parsed.filters) || {};
    const filters = {
      type: ['rent', 'sale'].includes(f.type) ? f.type : null,
      category: ['condo', 'house', 'townhouse', 'land', 'commercial'].includes(f.category) ? f.category : null,
      min: Number(f.min) > 0 ? Number(f.min) : null,
      max: Number(f.max) > 0 ? Number(f.max) : null,
      beds: Number(f.beds) > 0 ? Math.min(Number(f.beds), 10) : null,
      q: String(f.q || '').slice(0, 80)
    };

    const where = [`status='active'`]; const args = [];
    const add = (c, v) => { args.push(v); where.push(c.replace('?', '$' + args.length)); };
    if (filters.type) add('listing_type=?', filters.type);
    if (filters.category) add('category=?', filters.category);
    if (filters.min) add('price>=?', filters.min);
    if (filters.max) add('price<=?', filters.max);
    if (filters.beds) add('bedrooms>=?', filters.beds);
    if (filters.q) { args.push('%' + filters.q + '%'); const p = '$' + args.length; where.push(`(title ILIKE ${p} OR location_text ILIKE ${p} OR province ILIKE ${p} OR description ILIKE ${p})`); }
    const { rows } = await pool.query(
      `SELECT ${LISTING_FIELDS} FROM listings WHERE ${where.join(' AND ')} ORDER BY featured DESC, created_at DESC LIMIT 6`, args);

    let reply = (parsed && parsed.reply) || '';
    if (!reply) {
      const bits = [];
      if (filters.type) bits.push(filters.type === 'rent' ? 'เช่า' : 'ขาย');
      if (filters.category) bits.push({ condo: 'คอนโด', house: 'บ้านเดี่ยว', townhouse: 'ทาวน์เฮาส์', land: 'ที่ดิน', commercial: 'อาคารพาณิชย์' }[filters.category]);
      if (filters.q) bits.push('ย่าน' + filters.q);
      reply = rows.length
        ? `หา${bits.join(' ') || 'ทรัพย์'}มาให้แล้ว ${rows.length} รายการครับ ลองดูด้านล่างได้เลย`
        : `ยังไม่เจอทรัพย์ที่ตรงเป๊ะครับ ลองปรับเงื่อนไข หรือกดตั้งแจ้งเตือนไว้ได้`;
    } else if (!rows.length) {
      reply += ' (ตอนนี้ยังไม่มีรายการตรงเป๊ะ ลองปรับเงื่อนไขดูได้ครับ)';
    }
    res.json({ reply, filters, items: rows });
  } catch (e) { console.error('concierge:', e.message); res.status(500).json({ reply: 'ขออภัยครับ ระบบขัดข้องชั่วคราว ลองใหม่อีกครั้ง', items: [] }); }
});

// ============ Area reviews (รีวิวทำเล) ============
const reviewHits = new Map();
app.get('/api/area-reviews', async (req, res) => {
  try {
    const province = String(req.query.province || '').slice(0, 80).trim();
    if (!province) return res.json({ avg: 0, count: 0, aspects: {}, items: [] });
    const agg = await pool.query(
      `SELECT COUNT(*)::int c, COALESCE(ROUND(AVG(rating)::numeric,1),0) avg FROM area_reviews WHERE province=$1 AND approved`, [province]);
    const items = await pool.query(
      `SELECT id, rating, aspects, author, comment, created_at FROM area_reviews
       WHERE province=$1 AND approved ORDER BY created_at DESC LIMIT 20`, [province]);
    const aspects = {};
    for (const r of items.rows) for (const a of (r.aspects || [])) aspects[a] = (aspects[a] || 0) + 1;
    res.json({ avg: Number(agg.rows[0].avg), count: agg.rows[0].c, aspects, items: items.rows });
  } catch (e) { console.error(e); res.status(500).json({ error: 'server error' }); }
});

app.post('/api/area-reviews', async (req, res) => {
  try {
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.ip || 'x';
    const now = Date.now(); const h = reviewHits.get(ip) || { c: 0, t: now };
    if (now - h.t > 3600e3) { h.c = 0; h.t = now; }
    if (h.c >= 8) return res.status(429).json({ error: 'ส่งรีวิวบ่อยเกินไป ลองใหม่ภายหลังครับ' });
    const b = req.body || {};
    const province = String(b.province || '').slice(0, 80).trim();
    const rating = Math.min(5, Math.max(1, parseInt(b.rating, 10) || 0));
    if (!province || !rating) return res.status(400).json({ error: 'กรุณาให้คะแนนและระบุทำเล' });
    const aspects = Array.isArray(b.aspects) ? b.aspects.filter(a => typeof a === 'string').slice(0, 6) : [];
    const author = String(b.author || '').slice(0, 60).trim();
    const comment = String(b.comment || '').slice(0, 600).trim();
    const { rows } = await pool.query(
      `INSERT INTO area_reviews (province, rating, aspects, author, comment) VALUES ($1,$2,$3,$4,$5) RETURNING id`,
      [province, rating, JSON.stringify(aspects), author, comment]);
    h.c++; reviewHits.set(ip, h);
    notifyTelegram(`⭐ รีวิวทำเลใหม่: ${province} (${rating}/5)${author ? ' โดย ' + author : ''}${comment ? '\n"' + comment.slice(0, 120) + '"' : ''}`);
    res.json({ ok: true, id: rows[0].id });
  } catch (e) { console.error(e); res.status(500).json({ error: 'server error' }); }
});

app.get('/api/admin/area-reviews', requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, province, rating, aspects, author, comment, approved, created_at
       FROM area_reviews ORDER BY created_at DESC LIMIT 300`);
    res.json({ items: rows });
  } catch (e) { console.error(e); res.status(500).json({ error: 'server error' }); }
});

app.delete('/api/admin/area-reviews/:id', requireAdmin, async (req, res) => {
  await pool.query('DELETE FROM area_reviews WHERE id=$1', [Number(req.params.id)]);
  res.json({ ok: true });
});

// ============ Listing reviews (รีวิวรายทรัพย์) ============
const listingReviewHits = new Map();
app.get('/api/listings/:id/reviews', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.json({ avg: 0, count: 0, items: [] });
    const agg = await pool.query(
      `SELECT COUNT(*)::int c, COALESCE(ROUND(AVG(rating)::numeric,1),0) avg FROM listing_reviews WHERE listing_id=$1 AND approved`, [id]);
    const items = await pool.query(
      `SELECT id, rating, author, comment, created_at FROM listing_reviews
       WHERE listing_id=$1 AND approved ORDER BY created_at DESC LIMIT 30`, [id]);
    res.json({ avg: Number(agg.rows[0].avg), count: agg.rows[0].c, items: items.rows });
  } catch (e) { console.error(e); res.status(500).json({ error: 'server error' }); }
});

app.post('/api/listing-reviews', async (req, res) => {
  try {
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.ip || 'x';
    const now = Date.now(); const h = listingReviewHits.get(ip) || { c: 0, t: now };
    if (now - h.t > 3600e3) { h.c = 0; h.t = now; }
    if (h.c >= 8) return res.status(429).json({ error: 'ส่งรีวิวบ่อยเกินไป ลองใหม่ภายหลังครับ' });
    const b = req.body || {};
    if (b.website) return res.json({ ok: true }); // honeypot
    const listing_id = Number(b.listing_id) || 0;
    const rating = Math.min(5, Math.max(1, parseInt(b.rating, 10) || 0));
    if (!listing_id || !rating) return res.status(400).json({ error: 'กรุณาให้คะแนนดาว' });
    const chk = await pool.query('SELECT title FROM listings WHERE id=$1', [listing_id]);
    if (!chk.rows[0]) return res.status(404).json({ error: 'ไม่พบทรัพย์นี้' });
    const author = String(b.author || '').slice(0, 60).trim();
    const comment = String(b.comment || '').slice(0, 600).trim();
    const { rows } = await pool.query(
      `INSERT INTO listing_reviews (listing_id, rating, author, comment) VALUES ($1,$2,$3,$4) RETURNING id`,
      [listing_id, rating, author, comment]);
    h.c++; listingReviewHits.set(ip, h);
    notifyTelegram(`⭐ รีวิวทรัพย์ใหม่: ${tgEsc(chk.rows[0].title)} (${rating}/5)${author ? ' โดย ' + tgEsc(author) : ''}${comment ? '\n"' + tgEsc(comment.slice(0, 120)) + '"' : ''}`);
    res.json({ ok: true, id: rows[0].id });
  } catch (e) { console.error(e); res.status(500).json({ error: 'server error' }); }
});

app.get('/api/admin/listing-reviews', requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT r.id, r.listing_id, r.rating, r.author, r.comment, r.approved, r.created_at, l.title
       FROM listing_reviews r LEFT JOIN listings l ON l.id=r.listing_id
       ORDER BY r.created_at DESC LIMIT 300`);
    res.json({ items: rows });
  } catch (e) { console.error(e); res.status(500).json({ error: 'server error' }); }
});
app.delete('/api/admin/listing-reviews/:id', requireAdmin, async (req, res) => {
  await pool.query('DELETE FROM listing_reviews WHERE id=$1', [Number(req.params.id)]);
  res.json({ ok: true });
});

// ============ Export CSV (สำหรับเจ้าของ) ============
function toCsv(rows, cols) {
  const esc = (v) => {
    if (v === null || v === undefined) return '';
    let s = String(v);
    if (v instanceof Date) s = v.toISOString();
    if (/[",\n\r]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
    return s;
  };
  const head = cols.map(c => esc(c.label)).join(',');
  const body = rows.map(r => cols.map(c => esc(r[c.key])).join(',')).join('\r\n');
  return '\uFEFF' + head + '\r\n' + body; // BOM for Excel Thai
}
const EXPORTS = {
  listings: {
    sql: `SELECT id, title, listing_type, category, price, province, location_text, bedrooms, bathrooms, area_sqm, status, views, created_at FROM listings ORDER BY created_at DESC`,
    cols: [
      { key: 'id', label: 'ID' }, { key: 'title', label: 'ชื่อประกาศ' }, { key: 'listing_type', label: 'ประเภท' },
      { key: 'category', label: 'หมวด' }, { key: 'price', label: 'ราคา' }, { key: 'province', label: 'จังหวัด' },
      { key: 'location_text', label: 'ทำเล' }, { key: 'bedrooms', label: 'ห้องนอน' }, { key: 'bathrooms', label: 'ห้องน้ำ' },
      { key: 'area_sqm', label: 'พื้นที่(ตร.ม.)' }, { key: 'status', label: 'สถานะ' }, { key: 'views', label: 'ยอดเข้าชม' }, { key: 'created_at', label: 'สร้างเมื่อ' }
    ]
  },
  inquiries: {
    sql: `SELECT i.id, i.name, i.phone, i.line_id, i.message, l.title AS listing, i.created_at
          FROM inquiries i LEFT JOIN listings l ON l.id=i.listing_id ORDER BY i.created_at DESC`,
    cols: [
      { key: 'id', label: 'ID' }, { key: 'name', label: 'ชื่อ' }, { key: 'phone', label: 'เบอร์โทร' },
      { key: 'line_id', label: 'LINE' }, { key: 'message', label: 'ข้อความ' }, { key: 'listing', label: 'ทรัพย์' }, { key: 'created_at', label: 'เมื่อ' }
    ]
  },
  appointments: {
    sql: `SELECT a.id, a.name, a.phone, a.line_id, a.visit_date, a.visit_time, a.status, l.title AS listing, a.created_at
          FROM appointments a LEFT JOIN listings l ON l.id=a.listing_id ORDER BY a.visit_date DESC`,
    cols: [
      { key: 'id', label: 'ID' }, { key: 'name', label: 'ชื่อ' }, { key: 'phone', label: 'เบอร์โทร' },
      { key: 'line_id', label: 'LINE' }, { key: 'visit_date', label: 'วันที่นัด' }, { key: 'visit_time', label: 'เวลา' },
      { key: 'status', label: 'สถานะ' }, { key: 'listing', label: 'ทรัพย์' }, { key: 'created_at', label: 'จองเมื่อ' }
    ]
  }
};
app.get('/api/admin/export/:type', requireAdmin, async (req, res) => {
  try {
    const cfg = EXPORTS[req.params.type];
    if (!cfg) return res.status(400).json({ error: 'unknown export type' });
    const { rows } = await pool.query(cfg.sql);
    const csv = toCsv(rows, cfg.cols);
    const stamp = new Date().toISOString().slice(0, 10);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="yoojai-${req.params.type}-${stamp}.csv"`);
    res.send(csv);
  } catch (e) { console.error(e); res.status(500).json({ error: 'server error' }); }
});

// ============ User accounts ============
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
app.post('/api/auth/register', async (req, res) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase().slice(0, 120);
    const password = String(req.body?.password || '');
    const name = String(req.body?.name || '').trim().slice(0, 80);
    if (!emailRe.test(email)) return res.status(400).json({ error: 'อีเมลไม่ถูกต้อง' });
    if (password.length < 6) return res.status(400).json({ error: 'รหัสผ่านอย่างน้อย 6 ตัวอักษร' });
    const exists = await pool.query('SELECT 1 FROM users WHERE email=$1', [email]);
    if (exists.rows[0]) return res.status(409).json({ error: 'อีเมลนี้ถูกใช้แล้ว' });
    const { rows } = await pool.query(
      'INSERT INTO users (email, pass_hash, name) VALUES ($1,$2,$3) RETURNING id, email, name',
      [email, hashPassword(password), name]);
    // sync รายการโปรดจากเครื่อง (ถ้าส่งมา)
    const favs = Array.isArray(req.body?.favorites) ? req.body.favorites.map(Number).filter(Boolean).slice(0, 200) : [];
    for (const fid of favs) await pool.query('INSERT INTO user_favorites (user_id, listing_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [rows[0].id, fid]).catch(() => {});
    setSessionCookie(res, rows[0].id);
    res.json({ user: { id: rows[0].id, email: rows[0].email, name: rows[0].name } });
  } catch (e) { console.error(e); res.status(500).json({ error: 'server error' }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    const { rows } = await pool.query('SELECT id, email, name, pass_hash FROM users WHERE email=$1', [email]);
    const u = rows[0];
    if (!u || !verifyPassword(password, u.pass_hash)) return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    const favs = Array.isArray(req.body?.favorites) ? req.body.favorites.map(Number).filter(Boolean).slice(0, 200) : [];
    for (const fid of favs) await pool.query('INSERT INTO user_favorites (user_id, listing_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [u.id, fid]).catch(() => {});
    setSessionCookie(res, u.id);
    res.json({ user: { id: u.id, email: u.email, name: u.name } });
  } catch (e) { console.error(e); res.status(500).json({ error: 'server error' }); }
});

app.post('/api/auth/logout', (req, res) => {
  res.setHeader('Set-Cookie', 'yj_session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax');
  res.json({ ok: true });
});

app.get('/api/auth/me', async (req, res) => {
  const uid = currentUser(req);
  if (!uid) return res.json({ user: null });
  try {
    const { rows } = await pool.query('SELECT id, email, name FROM users WHERE id=$1', [uid]);
    res.json({ user: rows[0] || null });
  } catch (e) { res.json({ user: null }); }
});

// รายการโปรดของผู้ใช้ (ข้ามอุปกรณ์)
app.get('/api/user/favorites', async (req, res) => {
  const uid = currentUser(req);
  if (!uid) return res.status(401).json({ error: 'ยังไม่ได้เข้าสู่ระบบ' });
  const { rows } = await pool.query('SELECT listing_id FROM user_favorites WHERE user_id=$1', [uid]);
  res.json({ ids: rows.map(r => r.listing_id) });
});
app.post('/api/user/favorites', async (req, res) => {
  const uid = currentUser(req);
  if (!uid) return res.status(401).json({ error: 'ยังไม่ได้เข้าสู่ระบบ' });
  const id = Number(req.body?.listing_id) || 0;
  if (!id) return res.status(400).json({ error: 'bad id' });
  if (req.body?.on) await pool.query('INSERT INTO user_favorites (user_id, listing_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [uid, id]);
  else await pool.query('DELETE FROM user_favorites WHERE user_id=$1 AND listing_id=$2', [uid, id]);
  res.json({ ok: true });
});

// ============ Reports (แจ้งประกาศผิดปกติ) ============
const reportHits = new Map();
app.post('/api/reports', async (req, res) => {
  try {
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.ip || 'x';
    const now = Date.now(); const h = reportHits.get(ip) || { c: 0, t: now };
    if (now - h.t > 3600e3) { h.c = 0; h.t = now; }
    if (h.c >= 10) return res.status(429).json({ error: 'แจ้งบ่อยเกินไป ลองใหม่ภายหลัง' });
    const listing_id = Number(req.body?.listing_id) || null;
    const reason = String(req.body?.reason || '').slice(0, 60).trim();
    const detail = String(req.body?.detail || '').slice(0, 500).trim();
    if (!listing_id || !reason) return res.status(400).json({ error: 'ข้อมูลไม่ครบ' });
    await pool.query('INSERT INTO reports (listing_id, reason, detail) VALUES ($1,$2,$3)', [listing_id, reason, detail]);
    h.c++; reportHits.set(ip, h);
    notifyTelegram(`🚩 มีการแจ้งประกาศ #${listing_id}\nเหตุผล: ${reason}${detail ? '\n' + detail : ''}`);
    res.json({ ok: true });
  } catch (e) { console.error(e); res.status(500).json({ error: 'server error' }); }
});

app.get('/api/admin/reports', requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT r.id, r.listing_id, r.reason, r.detail, r.resolved, r.created_at, l.title
       FROM reports r LEFT JOIN listings l ON l.id = r.listing_id
       ORDER BY r.resolved ASC, r.created_at DESC LIMIT 300`);
    res.json({ items: rows });
  } catch (e) { console.error(e); res.status(500).json({ error: 'server error' }); }
});
app.post('/api/admin/reports/:id/resolve', requireAdmin, async (req, res) => {
  await pool.query('UPDATE reports SET resolved=true WHERE id=$1', [Number(req.params.id)]);
  res.json({ ok: true });
});

// ============ Appointments (นัดชมทรัพย์) ============
const apptHits = new Map();
app.post('/api/appointments', async (req, res) => {
  try {
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.ip || 'x';
    const now = Date.now(); const h = apptHits.get(ip) || { c: 0, t: now };
    if (now - h.t > 3600e3) { h.c = 0; h.t = now; }
    if (h.c >= 12) return res.status(429).json({ error: 'ส่งคำขอบ่อยเกินไป ลองใหม่ภายหลัง' });
    const b = req.body || {};
    if (b.website) return res.json({ ok: true }); // honeypot
    const name = String(b.name || '').trim().slice(0, 120);
    const contact = String(b.contact || '').trim().slice(0, 120);
    const visit_date = String(b.visit_date || '').slice(0, 10);
    if (!name || !contact || !visit_date || !/^\d{4}-\d{2}-\d{2}$/.test(visit_date))
      return res.status(400).json({ error: 'กรุณากรอกชื่อ ช่องทางติดต่อ และวันที่' });
    const isPhone = /[0-9]{6,}/.test(contact.replace(/[^0-9]/g, ''));
    const { rows } = await pool.query(
      `INSERT INTO appointments (listing_id, name, phone, line_id, visit_date, visit_time, note)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
      [Number(b.listing_id) || null, name, isPhone ? contact : '', isPhone ? '' : contact,
       visit_date, String(b.visit_time || '').slice(0, 40), String(b.note || '').slice(0, 500)]);
    h.c++; apptHits.set(ip, h);
    (async () => {
      let title = '';
      if (b.listing_id) { const r = await pool.query('SELECT title FROM listings WHERE id=$1', [Number(b.listing_id)]).catch(() => ({ rows: [] })); if (r.rows[0]) title = r.rows[0].title; }
      notifyOwner(`คำขอนัดชมใหม่${title ? ' — ' + title : ''}`, `📅 <b>คำขอนัดชมใหม่</b>\n${title ? '🏠 ' + tgEsc(title) + '\n' : ''}👤 ${tgEsc(name)}\n📞 ${tgEsc(contact)}\n🗓 ${visit_date} ${tgEsc(String(b.visit_time || ''))}`);
    })();
    res.json({ ok: true, id: rows[0].id });
  } catch (e) { console.error(e); res.status(500).json({ error: 'server error' }); }
});

app.get('/api/admin/appointments', requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT a.*, l.title FROM appointments a LEFT JOIN listings l ON l.id=a.listing_id
       ORDER BY a.visit_date ASC, a.created_at DESC LIMIT 500`);
    res.json({ items: rows });
  } catch (e) { console.error(e); res.status(500).json({ error: 'server error' }); }
});
app.post('/api/admin/appointments/:id/status', requireAdmin, async (req, res) => {
  const status = ['pending', 'confirmed', 'done', 'cancelled'].includes(req.body?.status) ? req.body.status : 'pending';
  await pool.query('UPDATE appointments SET status=$1 WHERE id=$2', [status, Number(req.params.id)]);
  res.json({ ok: true });
});

// ============ Agents (ทีมผู้ดูแลทรัพย์) ============
app.get('/api/agents', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, name, role, phone, line_id, photo_url, bio FROM agents WHERE active ORDER BY name');
    res.json({ items: rows });
  } catch (e) { res.json({ items: [] }); }
});
app.get('/api/admin/agents', requireAdmin, async (req, res) => {
  const { rows } = await pool.query(
    `SELECT a.*, (SELECT COUNT(*)::int FROM listings WHERE agent_id=a.id) AS listings
     FROM agents a ORDER BY a.created_at DESC`);
  res.json({ items: rows });
});
function agentParams(b) {
  return [
    String(b.name || '').trim().slice(0, 120),
    String(b.role || 'ผู้ดูแลทรัพย์').slice(0, 80),
    String(b.phone || '').slice(0, 40),
    String(b.line_id || '').slice(0, 80),
    String(b.photo_url || '').slice(0, 500),
    String(b.bio || '').slice(0, 500),
    b.active === false ? false : true
  ];
}
app.post('/api/admin/agents', requireAdmin, async (req, res) => {
  try {
    const p = agentParams(req.body || {});
    if (!p[0]) return res.status(400).json({ error: 'กรุณากรอกชื่อ' });
    const { rows } = await pool.query(
      `INSERT INTO agents (name, role, phone, line_id, photo_url, bio, active) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`, p);
    res.json({ ok: true, id: rows[0].id });
  } catch (e) { console.error(e); res.status(500).json({ error: 'server error' }); }
});
app.put('/api/admin/agents/:id', requireAdmin, async (req, res) => {
  try {
    const p = agentParams(req.body || {});
    await pool.query(
      `UPDATE agents SET name=$1, role=$2, phone=$3, line_id=$4, photo_url=$5, bio=$6, active=$7 WHERE id=$8`,
      [...p, Number(req.params.id)]);
    res.json({ ok: true });
  } catch (e) { console.error(e); res.status(500).json({ error: 'server error' }); }
});
app.delete('/api/admin/agents/:id', requireAdmin, async (req, res) => {
  await pool.query('UPDATE listings SET agent_id=NULL WHERE agent_id=$1', [Number(req.params.id)]);
  await pool.query('DELETE FROM agents WHERE id=$1', [Number(req.params.id)]);
  res.json({ ok: true });
});

// ============ Analytics ============
app.get('/api/admin/analytics', requireAdmin, async (req, res) => {
  try {
    const [searches, provinces, viewsTrend, topSearchers] = await Promise.all([
      pool.query(`SELECT lower(ref) term, COUNT(*)::int c FROM events
                  WHERE type='search' AND created_at >= now() - interval '30 days' AND ref <> ''
                  GROUP BY lower(ref) ORDER BY c DESC LIMIT 12`),
      pool.query(`SELECT meta->>'province' prov, COUNT(*)::int c FROM events
                  WHERE type='view' AND created_at >= now() - interval '30 days' AND meta->>'province' <> ''
                  GROUP BY meta->>'province' ORDER BY c DESC LIMIT 10`),
      pool.query(`SELECT to_char(created_at::date,'YYYY-MM-DD') d, COUNT(*)::int c FROM events
                  WHERE type='view' AND created_at >= now() - interval '13 days'
                  GROUP BY 1 ORDER BY 1`),
      pool.query(`SELECT COUNT(*)::int c FROM events WHERE type='search' AND created_at >= now() - interval '30 days'`)
    ]);
    // ทรัพย์ที่ควรปรับปรุง: เผยแพร่อยู่ แต่ยอดเข้าชมน้อย/ไม่มีคนติดต่อ
    const needsAttention = await pool.query(
      `SELECT l.id, l.title, l.views,
        (SELECT COUNT(*)::int FROM inquiries WHERE listing_id=l.id) inquiries,
        (SELECT COUNT(*)::int FROM listings WHERE jsonb_array_length(COALESCE(images,'[]'::jsonb))=0 AND id=l.id) noimg
       FROM listings l WHERE l.status='active'
       ORDER BY l.views ASC, inquiries ASC LIMIT 6`);
    const series = [];
    const map = Object.fromEntries(viewsTrend.rows.map(r => [r.d, r.c]));
    for (let k = 13; k >= 0; k--) { const dt = new Date(Date.now() - k * 864e5).toISOString().slice(0, 10); series.push({ d: dt, c: map[dt] || 0 }); }
    res.json({ searches: searches.rows, provinces: provinces.rows, viewsTrend: series, totalSearches: topSearchers.rows[0].c, needsAttention: needsAttention.rows });
  } catch (e) { console.error(e); res.status(500).json({ error: 'server error' }); }
});

app.get('/api/admin/business-summary', requireAdmin, async (req, res) => {
  try {
    const [portfolio, leads, appts, reviews, topPerf, provDist] = await Promise.all([
      pool.query(`SELECT
        COUNT(*) FILTER (WHERE status='active')::int active,
        COUNT(*) FILTER (WHERE status='active' AND listing_type='sale')::int active_sale,
        COUNT(*) FILTER (WHERE status='active' AND listing_type='rent')::int active_rent,
        COUNT(*) FILTER (WHERE status='draft')::int drafts,
        COALESCE(SUM(price) FILTER (WHERE status='active' AND listing_type='sale'),0)::bigint sale_value,
        COALESCE(SUM(views) FILTER (WHERE status='active'),0)::bigint total_views
        FROM listings`),
      pool.query(`SELECT
        COUNT(*) FILTER (WHERE created_at >= now() - interval '30 days')::int m0,
        COUNT(*) FILTER (WHERE created_at >= now() - interval '60 days' AND created_at < now() - interval '30 days')::int m1,
        COUNT(*)::int total
        FROM inquiries`),
      pool.query(`SELECT
        COUNT(*) FILTER (WHERE status='pending')::int pending,
        COUNT(*) FILTER (WHERE status IN ('pending','confirmed') AND visit_date >= current_date)::int upcoming
        FROM appointments`),
      pool.query(`SELECT COALESCE(ROUND(AVG(rating)::numeric,1),0) avg, COUNT(*)::int c FROM listing_reviews WHERE approved`),
      pool.query(`SELECT l.id, l.title, l.views,
        (SELECT COUNT(*)::int FROM inquiries WHERE listing_id=l.id) inquiries
        FROM listings l WHERE l.status='active' ORDER BY l.views DESC LIMIT 5`),
      pool.query(`SELECT province, COUNT(*)::int c FROM listings WHERE status='active' AND province<>'' GROUP BY province ORDER BY c DESC LIMIT 6`)
    ]);
    const L = leads.rows[0];
    const trend = L.m1 > 0 ? Math.round(((L.m0 - L.m1) / L.m1) * 100) : (L.m0 > 0 ? 100 : 0);
    const totalViews = Number(portfolio.rows[0].total_views) || 0;
    const conversion = totalViews > 0 ? +(L.total / totalViews * 100).toFixed(1) : 0;
    res.json({
      portfolio: portfolio.rows[0],
      leads: { month: L.m0, prevMonth: L.m1, total: L.total, trend },
      appointments: appts.rows[0],
      rating: reviews.rows[0],
      conversion,
      topPerformers: topPerf.rows,
      provinces: provDist.rows
    });
  } catch (e) { console.error(e); res.status(500).json({ error: 'server error' }); }
});

app.post('/api/admin/login', (req, res) => {
  if ((req.body?.password || '') === ADMIN_PASSWORD) return res.json({ token: adminToken() });
  res.status(401).json({ error: 'รหัสผ่านไม่ถูกต้อง' });
});

// ============ ข้อมูลตัวอย่าง (Demo) — โหลด/ล้างได้ ไม่ปน production ============
app.get('/api/admin/demo/status', requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT COUNT(*) FILTER (WHERE is_demo)::int demo, COUNT(*) FILTER (WHERE NOT is_demo)::int real FROM listings`);
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: 'server error' }); }
});
app.post('/api/admin/demo/load', requireAdmin, async (req, res) => {
  try {
    const existing = await pool.query('SELECT COUNT(*)::int c FROM listings WHERE is_demo');
    if (existing.rows[0].c > 0) return res.status(400).json({ error: 'มีข้อมูลตัวอย่างอยู่แล้ว — ล้างก่อนถ้าต้องการโหลดใหม่' });
    let n = 0;
    for (const s of SEED) {
      const base = PROV_COORD[s.province];
      const jit = () => (Math.random() - 0.5) * 0.06;
      const lat = base ? +(base[0] + jit()).toFixed(6) : null;
      const lng = base ? +(base[1] + jit()).toFixed(6) : null;
      await pool.query(
        `INSERT INTO listings (title, listing_type, category, price, location_text, province, bedrooms, bathrooms,
          area_sqm, land_area_sqwah, floor_text, description, highlights, images, nearby, pets_allowed, featured,
          amenities, furnishings, common_fee_text, year_built, latitude, longitude, status, is_demo)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,'active',true)`,
        [s.title, s.listing_type, s.category, s.price, s.location_text, s.province, s.bedrooms || 0, s.bathrooms || 0,
         s.area_sqm || 0, s.land_area_sqwah || 0, s.floor_text || '', s.description, JSON.stringify(s.highlights || []),
         JSON.stringify(s.images || []), JSON.stringify(s.nearby || []), !!s.pets_allowed, !!s.featured,
         JSON.stringify(s.amenities || []), JSON.stringify(s.furnishings || []), s.common_fee_text || '', s.year_built || null, lat, lng]);
      n++;
    }
    res.json({ ok: true, added: n });
  } catch (e) { console.error(e); res.status(500).json({ error: 'server error' }); }
});
app.post('/api/admin/demo/clear', requireAdmin, async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM listings WHERE is_demo');
    res.json({ ok: true, removed: rowCount });
  } catch (e) { console.error(e); res.status(500).json({ error: 'server error' }); }
});

app.get('/api/admin/stats', requireAdmin, async (req, res) => {
  const [l, i, v, t, top, trend, ss] = await Promise.all([
    pool.query(`SELECT status, COUNT(*)::int c FROM listings GROUP BY status`),
    pool.query(`SELECT COUNT(*)::int c, COUNT(*) FILTER (WHERE NOT is_read)::int unread FROM inquiries`),
    pool.query(`SELECT COALESCE(SUM(views),0)::int v FROM listings`),
    pool.query(`SELECT listing_type, COUNT(*)::int c FROM listings WHERE status='active' GROUP BY listing_type`),
    pool.query(`SELECT id, title, views, listing_type, category, price FROM listings ORDER BY views DESC NULLS LAST LIMIT 5`),
    pool.query(`SELECT to_char(created_at::date,'YYYY-MM-DD') d, COUNT(*)::int c
                FROM inquiries WHERE created_at >= now() - interval '13 days'
                GROUP BY 1 ORDER BY 1`),
    pool.query(`SELECT COUNT(*)::int c, COUNT(*) FILTER (WHERE active)::int active FROM saved_searches`)
  ]);
  const byStatus = Object.fromEntries(l.rows.map(r => [r.status, r.c]));
  const byType = Object.fromEntries(t.rows.map(r => [r.listing_type, r.c]));
  const series = [];
  const map = Object.fromEntries(trend.rows.map(r => [r.d, r.c]));
  for (let k = 13; k >= 0; k--) {
    const dt = new Date(Date.now() - k * 864e5).toISOString().slice(0, 10);
    series.push({ d: dt, c: map[dt] || 0 });
  }
  res.json({
    active: byStatus.active || 0, draft: byStatus.draft || 0, closed: byStatus.closed || 0,
    inquiries: i.rows[0].c, unread: i.rows[0].unread, views: v.rows[0].v,
    rent: byType.rent || 0, sale: byType.sale || 0,
    topViewed: top.rows, inquiryTrend: series,
    savedSearches: ss.rows[0].c, savedSearchesActive: ss.rows[0].active
  });
});

app.get('/api/admin/saved-searches', requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT s.id, s.label, s.criteria, s.channel, s.contact, s.active, s.created_at,
              COUNT(m.listing_id)::int AS matches
       FROM saved_searches s LEFT JOIN search_matches m ON m.search_id = s.id
       GROUP BY s.id ORDER BY s.created_at DESC LIMIT 200`);
    res.json({ items: rows });
  } catch (e) { console.error(e); res.status(500).json({ error: 'server error' }); }
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
    String(b.contact_phone || '').slice(0, 40),
    Number.isFinite(Number(b.latitude)) && b.latitude !== '' && b.latitude !== null ? Number(b.latitude) : null,
    Number.isFinite(Number(b.longitude)) && b.longitude !== '' && b.longitude !== null ? Number(b.longitude) : null,
    JSON.stringify(Array.isArray(b.amenities) ? b.amenities.slice(0, 30).map(x => String(x).slice(0, 60)) : []),
    JSON.stringify(Array.isArray(b.furnishings) ? b.furnishings.slice(0, 30).map(x => String(x).slice(0, 60)) : []),
    String(b.common_fee_text || '').slice(0, 120),
    Number.isInteger(Number(b.year_built)) && Number(b.year_built) > 1900 ? Number(b.year_built) : null,
    ['', 'hot', 'price_drop', 'new_project', 'urgent'].includes(b.badge) ? b.badge : '',
    !!b.verified,
    Number(b.agent_id) > 0 ? Number(b.agent_id) : null
  ];
}


// ดึงพิกัดจากลิงก์ Google Maps ถ้าผู้ใช้วางมา (รองรับรูปแบบ @lat,lng และ q=lat,lng และ !3dlat!4dlng)
function coordsFromMapUrl(url) {
  const s = String(url || '');
  if (!s) return null;
  let m = s.match(/@(-?\d{1,3}\.\d+),(-?\d{1,3}\.\d+)/)
    || s.match(/[?&]q=(-?\d{1,3}\.\d+),(-?\d{1,3}\.\d+)/)
    || s.match(/!3d(-?\d{1,3}\.\d+)!4d(-?\d{1,3}\.\d+)/)
    || s.match(/[?&]ll=(-?\d{1,3}\.\d+),(-?\d{1,3}\.\d+)/);
  if (!m) return null;
  const lat = Number(m[1]), lng = Number(m[2]);
  if (lat >= 5 && lat <= 21 && lng >= 96 && lng <= 106) return [lat, lng]; // อยู่ในกรอบประเทศไทย
  if (Number.isFinite(lat) && Number.isFinite(lng)) return [lat, lng];
  return null;
}

// ถ้าไม่ได้ระบุพิกัด ให้ใช้พิกัดจังหวัดแทน (สุ่มกระจายเล็กน้อย) — ทรัพย์จะขึ้นบนแผนที่เสมอ
function applyProvinceCoordFallback(p, mapUrl) {
  // p[5]=province, p[20]=latitude, p[21]=longitude
  if (p[20] == null && p[21] == null) {
    const fromUrl = coordsFromMapUrl(mapUrl);
    if (fromUrl) { p[20] = +fromUrl[0].toFixed(6); p[21] = +fromUrl[1].toFixed(6); return p; }
    const base = PROV_COORD[p[5]];
    if (base) {
      const jit = () => (Math.random() - 0.5) * 0.06;
      p[20] = +(base[0] + jit()).toFixed(6);
      p[21] = +(base[1] + jit()).toFixed(6);
    }
  }
  return p;
}

app.post('/api/admin/listings', requireAdmin, async (req, res) => {
  try {
    const p = applyProvinceCoordFallback(listingParams(req.body || {}), (req.body || {}).map_url);
    if (!p[0]) return res.status(400).json({ error: 'กรุณากรอกชื่อประกาศ' });
    const { rows } = await pool.query(
      `INSERT INTO listings (title, listing_type, category, price, location_text, province,
        bedrooms, bathrooms, area_sqm, land_area_sqwah, floor_text, description, highlights,
        images, nearby, pets_allowed, featured, status, contact_line, contact_phone, latitude, longitude,
        amenities, furnishings, common_fee_text, year_built, badge, verified, agent_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29)
       RETURNING id`, p);
    res.json({ ok: true, id: rows[0].id });
    runSavedSearchMatch(rows[0].id);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server error' });
  }
});

// ============ นำเข้าทรัพย์ทีละหลายรายการ ============
// รับ rows (array of plain objects จาก CSV ที่ parse ฝั่ง client) แล้ว validate + insert ทีเดียว
app.post('/api/admin/listings/bulk', requireAdmin, async (req, res) => {
  const rows = Array.isArray(req.body?.rows) ? req.body.rows : [];
  if (!rows.length) return res.status(400).json({ error: 'ไม่มีข้อมูลให้นำเข้า' });
  if (rows.length > 500) return res.status(400).json({ error: 'นำเข้าได้สูงสุด 500 รายการต่อครั้ง' });
  const publish = req.body?.publish === true; // true = เผยแพร่เลย, false = เก็บเป็นร่าง
  const results = { ok: 0, failed: 0, errors: [], ids: [] };
  const splitList = (v) => String(v || '').split(/[|;\n]+/).map(s => s.trim()).filter(Boolean);
  const client = await pool.connect();
  try {
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i] || {};
      try {
        const title = String(r.title || r['ชื่อประกาศ'] || '').trim();
        if (!title) { results.failed++; results.errors.push(`แถว ${i + 1}: ไม่มีชื่อประกาศ`); continue; }
        const typeRaw = String(r.listing_type || r['ประเภท'] || '').toLowerCase().trim();
        const listing_type = ['rent', 'เช่า'].includes(typeRaw) ? 'rent' : 'sale';
        const catMap = { 'บ้าน': 'house', 'บ้านเดี่ยว': 'house', 'คอนโด': 'condo', 'ทาวน์เฮาส์': 'townhouse', 'ที่ดิน': 'land', 'อาคารพาณิชย์': 'commercial' };
        const catRaw = String(r.category || r['หมวด'] || '').toLowerCase().trim();
        const category = ['house', 'condo', 'townhouse', 'land', 'commercial'].includes(catRaw) ? catRaw : (catMap[r.category || r['หมวด']] || 'condo');
        const body = {
          title, listing_type, category,
          price: Number(String(r.price || r['ราคา'] || '').replace(/[^0-9.]/g, '')) || 0,
          province: String(r.province || r['จังหวัด'] || '').trim(),
          location_text: String(r.location_text || r['ทำเล'] || '').trim(),
          bedrooms: Number(r.bedrooms || r['ห้องนอน'] || 0) || 0,
          bathrooms: Number(r.bathrooms || r['ห้องน้ำ'] || 0) || 0,
          area_sqm: Number(r.area_sqm || r['พื้นที่'] || 0) || 0,
          description: String(r.description || r['รายละเอียด'] || '').trim(),
          images: splitList(r.images || r['รูปภาพ']),
          pets_allowed: /^(true|1|yes|ได้|y)$/i.test(String(r.pets_allowed || r['เลี้ยงสัตว์'] || '')),
          status: publish ? 'active' : 'draft'
        };
        const p = applyProvinceCoordFallback(listingParams(body), r.map_url || r['ลิงก์แผนที่']);
        const { rows: ins } = await client.query(
          `INSERT INTO listings (title, listing_type, category, price, location_text, province,
            bedrooms, bathrooms, area_sqm, land_area_sqwah, floor_text, description, highlights,
            images, nearby, pets_allowed, featured, status, contact_line, contact_phone, latitude, longitude,
            amenities, furnishings, common_fee_text, year_built, badge, verified, agent_id)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29)
           RETURNING id`, p);
        results.ids.push(ins[0].id); results.ok++;
      } catch (e) { results.failed++; results.errors.push(`แถว ${i + 1}: ${e.message}`); }
    }
    if (results.errors.length > 20) results.errors = results.errors.slice(0, 20).concat(['…และอื่น ๆ']);
    res.json(results);
  } catch (e) { console.error(e); res.status(500).json({ error: 'server error' }); }
  finally { client.release(); }
});

// เทมเพลต CSV ให้ทีมดาวน์โหลดไปกรอก
app.get('/api/admin/import-template', requireAdmin, (req, res) => {
  const headers = ['title', 'listing_type', 'category', 'price', 'province', 'location_text', 'bedrooms', 'bathrooms', 'area_sqm', 'pets_allowed', 'images', 'map_url', 'description'];
  const sample = ['คอนโดใจกลางเมือง ใกล้ BTS', 'rent', 'condo', '18000', 'กรุงเทพมหานคร', 'อโศก', '1', '1', '35', 'true', 'https://url1.jpg | https://url2.jpg', 'https://maps.google.com/?q=13.7563,100.5018', 'ห้องสวย พร้อมอยู่ เฟอร์นิเจอร์ครบ'];
  const sample2 = ['บ้านเดี่ยว 2 ชั้น หมู่บ้านสงบ', 'sale', 'house', '4500000', 'นครปฐม', 'ศาลายา', '3', '2', '160', 'false', '', '', 'บ้านเดี่ยวพร้อมสวน ที่จอดรถ 2 คัน'];
  const csv = '\uFEFF' + [headers, sample, sample2].map(row => row.map(c => /[",\n]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c).join(',')).join('\r\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="yoojai-import-template.csv"');
  res.send(csv);
});

app.put('/api/admin/listings/:id', requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const p = applyProvinceCoordFallback(listingParams(req.body || {}), (req.body || {}).map_url);
    await pool.query(
      `UPDATE listings SET title=$1, listing_type=$2, category=$3, price=$4, location_text=$5,
        province=$6, bedrooms=$7, bathrooms=$8, area_sqm=$9, land_area_sqwah=$10, floor_text=$11,
        description=$12, highlights=$13, images=$14, nearby=$15, pets_allowed=$16, featured=$17,
        status=$18, contact_line=$19, contact_phone=$20, latitude=$21, longitude=$22,
        amenities=$23, furnishings=$24, common_fee_text=$25, year_built=$26, badge=$27, verified=$28, agent_id=$29, updated_at=now()
       WHERE id=$30`, [...p, id]);
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
    const dataUrl = String(req.body?.dataUrl || '').trim();
    const key = req.body?.variant === 'dark' ? 'logo_url_dark' : 'logo_url';
    if (dataUrl.length > 5_000_000) return res.status(400).json({ error: 'ไฟล์ใหญ่เกินไป (ไม่เกิน ~1.5MB)' });
    const m = dataUrl.match(/^data:image\/(png|jpe?g|webp|svg\+xml)(;charset=[\w-]+)?;base64,[A-Za-z0-9+/=\s]+$/i);
    if (!m) return res.status(400).json({ error: 'ไฟล์ไม่ถูกต้อง (รองรับ PNG, JPG, WEBP, SVG)' });
    await pool.query(
      `INSERT INTO settings (key, value) VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = $2`, [key, dataUrl]);
    settingsCache = null;
    res.json({ ok: true, key, logo_url: dataUrl });
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
        images, nearby, pets_allowed, featured, status, contact_line, contact_phone, latitude, longitude,
        amenities, furnishings, common_fee_text, year_built, badge, verified, agent_id)
       SELECT title || ' (สำเนา)', listing_type, category, price, location_text, province,
        bedrooms, bathrooms, area_sqm, land_area_sqwah, floor_text, description, highlights,
        images, nearby, pets_allowed, false, 'draft', contact_line, contact_phone, latitude, longitude,
        amenities, furnishings, common_fee_text, year_built, badge, false, agent_id
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

// ---------- AI Search (พิมพ์ภาษาคน -> ฟิลเตอร์) ----------
const aiSearchHits = new Map();
const inquiryHits = new Map();
app.post('/api/ai-search', async (req, res) => {
  try {
    if (!ANTHROPIC_API_KEY) return res.json({ fallback: true });
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.ip || 'x';
    const now = Date.now();
    const h = aiSearchHits.get(ip) || { c: 0, t: now };
    if (now - h.t > 3600e3) { h.c = 0; h.t = now; }
    h.c++;
    aiSearchHits.set(ip, h);
    if (h.c > 40) return res.json({ fallback: true });

    const q = String(req.body?.q || '').slice(0, 200).trim();
    if (q.length < 4) return res.json({ fallback: true });

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 250,
        messages: [{
          role: 'user',
          content: `แปลงคำค้นหาอสังหาริมทรัพย์ภาษาไทยนี้เป็น JSON เท่านั้น ห้ามมีข้อความอื่น:\n"${q}"\n\nรูปแบบ: {"type":"rent"|"sale"|null,"category":"condo"|"house"|"townhouse"|"land"|"commercial"|null,"min":ตัวเลข|null,"max":ตัวเลข|null,"beds":ตัวเลข|null,"q":"คีย์เวิร์ดทำเล/สถานที่/ชื่อโครงการ หรือ string ว่าง"}\n\nกติกา: "เช่า"=rent "ซื้อ/ขาย"=sale, "หมื่น"=10000 "แสน"=100000 "ล้าน"=1000000, "ไม่เกิน X"=max, "เลี้ยงสัตว์/เลี้ยงแมว/เลี้ยงหมา ได้" ให้ใส่คำว่า "เลี้ยงสัตว์" ต่อท้าย q, เอาเฉพาะชื่อสถานที่/ทำเลลง q ไม่ใส่คำว่าเช่า ซื้อ คอนโด ราคา`
        }]
      })
    });
    const out = await r.json();
    if (!r.ok) return res.json({ fallback: true });
    const text = (out.content || []).filter(c => c.type === 'text').map(c => c.text).join('').replace(/```json|```/g, '').trim();
    const f = JSON.parse(text);
    const filters = {
      type: ['rent', 'sale'].includes(f.type) ? f.type : null,
      category: ['condo', 'house', 'townhouse', 'land', 'commercial'].includes(f.category) ? f.category : null,
      min: Number.isFinite(Number(f.min)) && f.min > 0 ? Number(f.min) : null,
      max: Number.isFinite(Number(f.max)) && f.max > 0 ? Number(f.max) : null,
      beds: Number.isFinite(Number(f.beds)) && f.beds > 0 ? Math.min(Number(f.beds), 10) : null,
      q: String(f.q || '').slice(0, 100)
    };
    res.json({ filters });
  } catch (e) {
    console.error('ai-search:', e.message);
    res.json({ fallback: true });
  }
});

// ---------- Public AI Chat (ถาม-ตอบเกี่ยวกับประกาศ) ----------
const chatHits = new Map(); // ip -> { c, t }
setInterval(() => { // เคลียร์ทุกชั่วโมง กัน memory โต
  const now = Date.now();
  for (const [k, v] of chatHits) if (now - v.t > 3600e3) chatHits.delete(k);
}, 600e3).unref();

function listingFacts(l) {
  const typeTh = l.listing_type === 'sale' ? 'ขาย' : 'เช่า';
  const catTh = { house: 'บ้านเดี่ยว', condo: 'คอนโด', townhouse: 'ทาวน์เฮาส์', land: 'ที่ดิน', commercial: 'อาคารพาณิชย์' }[l.category] || 'อสังหาริมทรัพย์';
  return [
    `ชื่อประกาศ: ${l.title}`,
    `ประเภท: ${catTh} (${typeTh})`,
    `ราคา: ${Number(l.price).toLocaleString('th-TH')} บาท${l.listing_type === 'rent' ? '/เดือน' : ''}`,
    l.location_text && `ทำเล: ${l.location_text}${l.province ? ' จ.' + l.province : ''}`,
    l.bedrooms > 0 && `ห้องนอน: ${l.bedrooms}`,
    l.bathrooms > 0 && `ห้องน้ำ: ${l.bathrooms}`,
    Number(l.area_sqm) > 0 && `พื้นที่ใช้สอย: ${Number(l.area_sqm)} ตร.ม.`,
    Number(l.land_area_sqwah) > 0 && `ที่ดิน: ${Number(l.land_area_sqwah)} ตร.ว.`,
    l.floor_text && `ชั้น: ${l.floor_text}`,
    `สัตว์เลี้ยง: ${l.pets_allowed ? 'เลี้ยงได้' : 'ไม่อนุญาต'}`,
    l.year_built && `ปีที่สร้างเสร็จ: ${l.year_built}`,
    l.common_fee_text && `ค่าส่วนกลาง: ${l.common_fee_text}`,
    (l.amenities || []).length && `สิ่งอำนวยความสะดวกส่วนกลาง: ${(l.amenities || []).join(', ')}`,
    (l.furnishings || []).length && `เฟอร์นิเจอร์/เครื่องใช้ที่ให้: ${(l.furnishings || []).join(', ')}`,
    (l.highlights || []).length && `จุดเด่น: ${(l.highlights || []).join(', ')}`,
    (l.nearby || []).length && `สถานที่ใกล้เคียง: ${(l.nearby || []).map(n => `${n.label} (${n.dist})`).join(', ')}`,
    l.description && `รายละเอียด: ${String(l.description).slice(0, 900)}`
  ].filter(Boolean).join('\n');
}

app.post('/api/chat', async (req, res) => {
  try {
    if (!ANTHROPIC_API_KEY) return res.json({ fallback: true });

    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.ip || 'x';
    const now = Date.now();
    const h = chatHits.get(ip) || { c: 0, t: now };
    if (now - h.t > 3600e3) { h.c = 0; h.t = now; }
    h.c++;
    chatHits.set(ip, h);
    if (h.c > 30) return res.status(429).json({ error: 'ถามได้สูงสุด 30 ข้อความ/ชั่วโมง — ฝากข้อมูลติดต่อไว้ได้เลยครับ เดี๋ยวทีมงานตอบทุกคำถาม' });

    const { listing_id, messages } = req.body || {};
    const msgs = (Array.isArray(messages) ? messages : [])
      .slice(-10)
      .map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content || '').slice(0, 600) }))
      .filter(m => m.content);
    if (!msgs.length || msgs[msgs.length - 1].role !== 'user')
      return res.status(400).json({ error: 'bad messages' });

    let facts = 'ไม่มีข้อมูลประกาศเฉพาะ (ผู้ใช้อาจถามภาพรวมเว็บไซต์)';
    if (listing_id) {
      const { rows } = await pool.query(
        `SELECT ${LISTING_FIELDS} FROM listings WHERE id = $1 AND status = 'active'`, [Number(listing_id)]);
      if (rows[0]) facts = listingFacts(rows[0]);
    }
    const st = await getSettings().catch(() => ({}));
    const bn = brandName(st);

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 400,
        system: `คุณคือผู้ช่วยแชทของเว็บอสังหาริมทรัพย์ "${bn}" กำลังคุยกับผู้สนใจประกาศนี้:\n\n${facts}\n\nกติกา:\n- ตอบภาษาไทย สุภาพ เป็นกันเอง กระชับ 1-3 ประโยค\n- ตอบจากข้อมูลประกาศเท่านั้น ถ้าไม่มีข้อมูล (เช่น ค่าส่วนกลาง เงื่อนไขสัญญา ส่วนลด) ให้บอกตรง ๆ ว่าไม่ทราบ และแนะนำให้กด "ฝากข้อมูลติดต่อ" เพื่อให้ทีมงานตอบ\n- ห้ามแต่งราคา โปรโมชัน หรือข้อเท็จจริงที่ไม่มีในข้อมูล\n- ห้ามให้คำมั่นสัญญาแทนเจ้าของทรัพย์ และห้ามให้คำแนะนำกฎหมาย/สินเชื่อแบบเฉพาะเจาะจง\n- ถ้าผู้ใช้อยากนัดดูทรัพย์หรือต่อรอง ให้ชวนฝากชื่อ+เบอร์/LINE ผ่านปุ่มในแชท`,
        messages: msgs
      })
    });

    const out = await r.json();
    if (!r.ok) {
      console.error('chat AI error:', out?.error?.message);
      return res.json({ fallback: true });
    }
    const text = (out.content || []).filter(c => c.type === 'text').map(c => c.text).join('\n').trim();
    res.json({ reply: text || '...' });
  } catch (e) {
    console.error(e);
    res.json({ fallback: true });
  }
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
      d.year_built && `ปีที่สร้าง: ${d.year_built}`,
      d.common_fee_text && `ค่าส่วนกลาง: ${d.common_fee_text}`,
      d.amenities?.length && `ส่วนกลาง: ${d.amenities.join(', ')}`,
      d.furnishings?.length && `ของที่ให้: ${d.furnishings.join(', ')}`,
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
const homeTpl = fs.readFileSync(path.join(__dirname, 'public/index.html'), 'utf8');
const htmlEsc = (s) => String(s || '').replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
const baseUrl = (req) => process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;

app.get('/listing/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const { rows } = await pool.query(
      `SELECT id, title, description, images, price, listing_type, category, province
       FROM listings WHERE id = $1 AND status = 'active'`, [id]);
    if (rows[0]) {
      const l = rows[0];
      const base = baseUrl(req);
      const priceTxt = l.listing_type === 'rent'
        ? `฿${Number(l.price).toLocaleString('th-TH')}/เดือน`
        : `฿${Number(l.price).toLocaleString('th-TH')}`;
      const title = `${htmlEsc(l.title)} · ${priceTxt} — ${htmlEsc(brandName(await getSettings().catch(() => ({}))))}`;
      const desc = htmlEsc(String(l.description || '').slice(0, 160));
      const img = htmlEsc((l.images || [])[0] || '') || `${base}/img/og-default.png`;
      const gsv = process.env.GOOGLE_SITE_VERIFICATION;
      const og = `<title>${title}</title>
  <meta name="description" content="${desc}">
  <link rel="canonical" href="${base}/listing/${id}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="th_TH">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:image" content="${img}">
  <meta property="og:url" content="${base}/listing/${id}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${img}">
  ${gsv ? `<meta name="google-site-verification" content="${htmlEsc(gsv)}">` : ''}
  ${seo.listingLd(l, base)}`;
      return res.send(listingTpl.replace(/<title>[^<]*<\/title>/, og));
    }
  } catch (e) { console.error(e); }
  res.send(listingTpl);
});

// ---------- SEO: หน้าแรก (inject structured data) ----------
app.get('/', async (req, res) => {
  try {
    const base = baseUrl(req);
    const brand = brandName(await getSettings().catch(() => ({})));
    const gsv = process.env.GOOGLE_SITE_VERIFICATION;
    const inject = `  <link rel="canonical" href="${base}/">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="th_TH">
  <meta property="og:site_name" content="${htmlEsc(brand)}">
  <meta property="og:title" content="${htmlEsc(brand)} — ที่ที่ใช่ สำหรับชีวิตที่ดี">
  <meta property="og:description" content="รวมบ้านเช่า คอนโด บ้านขาย และที่ดินทั่วไทย ข้อมูลครบ ติดต่อตรง ดูแลโดยทีมงานมืออาชีพ">
  <meta property="og:url" content="${base}/">
  <meta property="og:image" content="${base}/img/og-default.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${base}/img/og-default.png">
  ${gsv ? `<meta name="google-site-verification" content="${htmlEsc(gsv)}">` : ''}
  ${seo.homeLd(base, brand)}
</head>`;
    return res.send(homeTpl.replace('</head>', inject));
  } catch (e) {
    return res.sendFile(path.join(__dirname, 'public/index.html'));
  }
});

// ---------- SEO: helpers สำหรับหน้าทำเล ----------
async function areaProvinces(limit = 60) {
  const { rows } = await pool.query(
    `SELECT province, COUNT(*)::int AS count FROM listings
     WHERE status='active' AND province <> ''
     GROUP BY province ORDER BY count DESC, province LIMIT $1`, [limit]);
  return rows;
}

async function areaData(location, type, category) {
  const where = [`status='active'`, `province = $1`];
  const params = [location];
  if (type) { params.push(type); where.push(`listing_type = $${params.length}`); }
  if (category) { params.push(category); where.push(`category = $${params.length}`); }
  const { rows } = await pool.query(
    `SELECT ${LISTING_FIELDS} FROM listings WHERE ${where.join(' AND ')}
     ORDER BY featured DESC, created_at DESC LIMIT 60`, params);

  // สถิติของทั้งทำเล (ไม่กรอง type/category) เอาไว้ทำชิป + intro
  const agg = await pool.query(
    `SELECT listing_type, category, price FROM listings WHERE status='active' AND province = $1`, [location]);
  const stats = { types: {}, cats: {}, rentMin: null, saleMin: null };
  for (const r of agg.rows) {
    stats.types[r.listing_type] = (stats.types[r.listing_type] || 0) + 1;
    stats.cats[r.category] = (stats.cats[r.category] || 0) + 1;
    const p = Number(r.price) || 0;
    if (r.listing_type === 'rent') stats.rentMin = stats.rentMin == null ? p : Math.min(stats.rentMin, p);
    if (r.listing_type === 'sale') stats.saleMin = stats.saleMin == null ? p : Math.min(stats.saleMin, p);
  }
  return { listings: rows, stats };
}

// ---------- SEO: หน้ารวมทำเลทั้งหมด ----------
app.get('/areas', async (req, res) => {
  try {
    const base = baseUrl(req);
    const brand = brandName(await getSettings().catch(() => ({})));
    const provinces = await areaProvinces();
    res.send(seo.renderAreasIndex({ provinces, baseUrl: base, brand }));
  } catch (e) { console.error(e); res.status(500).send('เกิดข้อผิดพลาด'); }
});

// ---------- SEO: หน้าทำเลอัตโนมัติ  /area/:location[/:type][/:category] ----------
app.get('/area/:location/:type?/:category?', async (req, res) => {
  try {
    const location = String(req.params.location || '').slice(0, 80).trim();
    let type = req.params.type;
    let category = req.params.category;
    if (!location) return res.redirect(302, '/areas');
    // ตรวจสอบ/ทำความสะอาดพารามิเตอร์ — ค่าไม่ถูกต้องให้ redirect ไปหน้าที่ถูกต้อง
    if (type && !seo.TYPES.includes(type)) return res.redirect(302, seo.areaUrl(location));
    if (category && !seo.CATS.includes(category)) return res.redirect(302, seo.areaUrl(location, type));

    const base = baseUrl(req);
    const brand = brandName(await getSettings().catch(() => ({})));
    const [{ listings, stats }, provinces] = await Promise.all([
      areaData(location, type, category),
      areaProvinces()
    ]);
    stats.brand = brand;
    res.send(seo.renderAreaPage({ location, type, category, listings, stats, provinces, baseUrl: base }));
  } catch (e) { console.error(e); res.status(500).send('เกิดข้อผิดพลาด'); }
});

app.get('/sitemap.xml', async (req, res) => {
  try {
    const base = baseUrl(req);
    const [listings, combos] = await Promise.all([
      pool.query(`SELECT id, updated_at FROM listings WHERE status='active' ORDER BY id`),
      pool.query(`SELECT province, listing_type, category, COUNT(*)::int AS c
                  FROM listings WHERE status='active' AND province <> ''
                  GROUP BY province, listing_type, category`)
    ]);
    const seen = new Set();
    const add = (loc) => { if (!seen.has(loc)) seen.add(loc); };
    add(`${base}/`); add(`${base}/search`); add(`${base}/areas`); add(`${base}/map`);
    add(`${base}/discover`); add(`${base}/about`); add(`${base}/contact`);
    add(`${base}/privacy`); add(`${base}/terms`);
    for (const r of combos.rows) {
      add(base + seo.areaUrl(r.province));                                  // hub ทำเล
      add(base + seo.areaUrl(r.province, r.listing_type));                  // ทำเล + เช่า/ขาย
      add(base + seo.areaUrl(r.province, r.listing_type, r.category));      // ทำเล + ประเภท + หมวด
    }
    const urls = [
      ...[...seen].map(u => `<url><loc>${u}</loc></url>`),
      ...listings.rows.map(r => `<url><loc>${base}/listing/${r.id}</loc><lastmod>${new Date(r.updated_at).toISOString().slice(0, 10)}</lastmod></url>`)
    ].join('');
    res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
  } catch (e) { console.error(e); res.status(500).send(''); }
});

app.get('/robots.txt', (req, res) =>
  res.type('text/plain').send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /saved\nDisallow: /compare\nSitemap: ${baseUrl(req)}/sitemap.xml`));

app.get('/saved', servePage('saved.html', { path: '/saved', title: 'รายการโปรดของฉัน', desc: 'ทรัพย์ที่คุณบันทึกไว้', robots: 'noindex' }));

// Favicon เชื่อมกับโลโก้ที่อัปโหลด (fallback = ไอคอนบ้านโทนเข้ม)
app.get('/favicon', async (req, res) => {
  res.set('Cache-Control', 'public, max-age=300');
  try {
    const st = await getSettings();
    const m = String(st.logo_url || '').match(/^data:(image\/[\w.+-]+)(?:;charset=[\w-]+)?;base64,([A-Za-z0-9+/=\s]+)$/);
    if (m) return res.type(m[1]).send(Buffer.from(m[2].replace(/\s/g, ''), 'base64'));
  } catch (e) { /* ใช้ default */ }
  res.type('image/svg+xml').send(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="24" fill="#191917"/><path d="M50 24 L78 48 L72 48 L72 74 L58 74 L58 58 L42 58 L42 74 L28 74 L28 48 L22 48 Z" fill="#b08d57"/></svg>`);
});
app.get('/favicon.ico', (req, res) => res.redirect(301, '/favicon'));
// ---------- SEO: เสิร์ฟหน้า static พร้อม OG/canonical/robots ครบ ----------
const pageTplCache = new Map();
function servePage(file, meta) {
  return async (req, res) => {
    try {
      if (!pageTplCache.has(file)) pageTplCache.set(file, fs.readFileSync(path.join(__dirname, 'public/' + file), 'utf8'));
      const tpl = pageTplCache.get(file);
      const base = baseUrl(req);
      const brand = brandName(await getSettings().catch(() => ({})));
      const title = `${meta.title} — ${brand}`;
      const url = base + meta.path;
      const gsv = process.env.GOOGLE_SITE_VERIFICATION;
      const inject = `  <link rel="canonical" href="${url}">
  ${meta.robots ? `<meta name="robots" content="${meta.robots}">` : ''}
  <meta property="og:type" content="website">
  <meta property="og:locale" content="th_TH">
  <meta property="og:site_name" content="${htmlEsc(brand)}">
  <meta property="og:title" content="${htmlEsc(title)}">
  <meta property="og:description" content="${htmlEsc(meta.desc || '')}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${base}/img/og-default.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${base}/img/og-default.png">
  ${gsv ? `<meta name="google-site-verification" content="${htmlEsc(gsv)}">` : ''}
</head>`;
      return res.send(tpl.replace('</head>', inject));
    } catch (e) { return res.sendFile(path.join(__dirname, 'public/' + file)); }
  };
}

app.get('/search', servePage('listings.html', { path: '/search', title: 'ค้นหาอสังหาริมทรัพย์', desc: 'ค้นหาบ้านเช่า บ้านขาย คอนโด และที่ดินทั่วไทย กรองตามงบ ทำเล และไลฟ์สไตล์' }));
app.get('/compare', servePage('compare.html', { path: '/compare', title: 'เปรียบเทียบทรัพย์', desc: 'เปรียบเทียบทรัพย์ที่สนใจแบบชัด ๆ ทุกมิติ', robots: 'noindex' }));
app.get('/map', servePage('map.html', { path: '/map', title: 'ค้นหาบ้านจากแผนที่', desc: 'ดูทรัพย์ทั้งหมดบนแผนที่ เลือกทำเลที่ใช่ได้ในคลิกเดียว' }));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public/admin.html')));
app.get('/about', servePage('about.html', { path: '/about', title: 'เกี่ยวกับเรา', desc: 'อยู่ใจ แพลตฟอร์มอสังหาริมทรัพย์ที่รวมบ้านเช่า บ้านขาย และที่ดินทั่วไทย ดูแลโดยทีมงานมืออาชีพ' }));
app.get('/contact', servePage('contact.html', { path: '/contact', title: 'ติดต่อเรา', desc: 'ติดต่อทีมงานอยู่ใจ ฝากทรัพย์ สอบถาม หรือให้เราช่วยหาบ้าน' }));
app.get('/privacy', servePage('privacy.html', { path: '/privacy', title: 'นโยบายความเป็นส่วนตัว', desc: 'นโยบายความเป็นส่วนตัวตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)' }));
app.get('/terms', servePage('terms.html', { path: '/terms', title: 'เงื่อนไขการใช้งาน', desc: 'เงื่อนไขการใช้งานเว็บไซต์อยู่ใจ' }));
app.get('/discover', servePage('discover.html', { path: '/discover', title: 'ปัดหาบ้านที่ใช่ 🃏', desc: 'ปัดขวาถ้าถูกใจ! ค้นหาบ้านในฝันแบบสนุก ๆ ทีละหลัง เก็บเข้ารายการโปรดอัตโนมัติ' }));
app.get('/healthz', (req, res) => res.json({ ok: true }));

// ---------- 404: หน้าไม่พบ (ต้องอยู่ท้ายสุดหลังทุก route) ----------
app.use((req, res) => {
  // API ที่ไม่พบ → JSON, หน้าเว็บ → หน้า 404 สวย ๆ
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'not found' });
  res.status(404).sendFile(path.join(__dirname, 'public/404.html'));
});

// ---------- Global error handler: จับทุก error ไม่ให้เว็บล่ม ----------
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && err.message);
  if (res.headersSent) return next(err);
  if (err && err.type === 'entity.parse.failed') return res.status(400).json({ error: 'ข้อมูลไม่ถูกต้อง' });
  if (req.path.startsWith('/api/')) return res.status(500).json({ error: 'server error' });
  res.status(500).send('เกิดข้อผิดพลาดชั่วคราว กรุณาลองใหม่');
});

// กัน process ตายจาก error ที่ไม่ได้ดัก
process.on('unhandledRejection', (r) => console.error('Unhandled rejection:', r && r.message ? r.message : r));
process.on('uncaughtException', (e) => console.error('Uncaught exception:', e && e.message ? e.message : e));

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
