// seo.js — ระบบ SEO: หน้าทำเลอัตโนมัติ (server-rendered) + Structured Data (JSON-LD)
// ทุกหน้าถูก render ฝั่งเซิร์ฟเวอร์เต็ม ๆ เพื่อให้ Google อ่านเนื้อหาได้ (ไม่ต้องรอ JS)

const CAT_LABEL = { house: 'บ้านเดี่ยว', condo: 'คอนโด', townhouse: 'ทาวน์เฮาส์', land: 'ที่ดิน', commercial: 'อาคารพาณิชย์' };
const CAT_ICON = { house: 'home', condo: 'building', townhouse: 'townhouse', land: 'land', commercial: 'store' };
const TYPE_LABEL = { rent: 'เช่า', sale: 'ขาย' };
const CATS = Object.keys(CAT_LABEL);
const TYPES = Object.keys(TYPE_LABEL);

// ไอคอน SVG ที่จำเป็นต่อการ์ด (ชุดเดียวกับ shared.js)
const IC = {
  home: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l-2 0l9 -9l9 9l-2 0"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"/><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"/></svg>',
  building: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21l18 0"/><path d="M9 8l1 0"/><path d="M9 12l1 0"/><path d="M9 16l1 0"/><path d="M14 8l1 0"/><path d="M14 12l1 0"/><path d="M14 16l1 0"/><path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16"/></svg>',
  townhouse: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21v-13l9 -4l9 4v13"/><path d="M13 13h4v8h-10v-6h6"/><path d="M13 21v-9a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v3"/></svg>',
  land: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 18.5l-3 -1.5l-6 3v-13l6 -3l6 3l6 -3v7.5"/><path d="M9 4v13"/><path d="M15 7v5.5"/><path d="M21.121 20.121a3 3 0 1 0 -4.242 0c.418 .419 1.125 1.045 2.121 1.879c1.051 -.89 1.759 -1.516 2.121 -1.879z"/><path d="M19 18v.01"/></svg>',
  store: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21l18 0"/><path d="M3 7v1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1h-18l2 -4h14l2 4"/><path d="M5 21l0 -10.15"/><path d="M19 21l0 -10.15"/><path d="M9 21v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4"/></svg>',
  pin: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"/><path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"/></svg>',
  bed: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v11m0 -4h18m0 4v-8a2 2 0 0 0 -2 -2h-8v6"/><path d="M7 10m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/></svg>',
  bath: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4v-3a1 1 0 0 1 1 -1z"/><path d="M6 12v-7a2 2 0 0 1 2 -2h3v2.25"/><path d="M4 21l1 -1.5"/><path d="M20 21l-1 -1.5"/></svg>',
  ruler: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h14a1 1 0 0 1 1 1v5a1 1 0 0 1 -1 1h-7a1 1 0 0 0 -1 1v7a1 1 0 0 1 -1 1h-5a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1"/><path d="M4 8l2 0"/><path d="M4 12l3 0"/><path d="M4 16l2 0"/><path d="M8 4l0 2"/><path d="M12 4l0 3"/><path d="M16 4l0 2"/></svg>',
  stairs: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4v-4h4v-4h4v-4h4"/></svg>',
  heart: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"/></svg>',
  arrowRight: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l14 0"/><path d="M13 18l6 -6"/><path d="M13 6l6 6"/></svg>'
};

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
const jesc = (s) => String(s ?? '').replace(/[<>&\u2028\u2029]/g, m => '\\u' + m.charCodeAt(0).toString(16).padStart(4, '0')); // ปลอดภัยใน <script>

function fmtPrice(n, type) {
  const num = Number(n) || 0;
  if (type === 'sale' && num >= 1000000) {
    const m = num / 1000000;
    return `฿${m % 1 === 0 ? m : m.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')} ล้าน`;
  }
  return `฿${num.toLocaleString('th-TH')}`;
}

// ---------- ลิงก์หน้าทำเล ----------
const areaUrl = (province, type, category) => {
  let u = `/area/${encodeURIComponent(province)}`;
  if (type) u += `/${type}`;
  if (category) u += `/${category}`;
  return u;
};

// ---------- การ์ดฝั่งเซิร์ฟเวอร์ (โครงสร้างเดียวกับ TD.card ใน shared.js) ----------
function cardHtml(l) {
  const img = (l.images && l.images[0]) || '';
  const specs = [];
  if (l.bedrooms > 0) specs.push(`<span class="spec">${IC.bed} ${l.bedrooms} นอน</span>`);
  if (l.bathrooms > 0) specs.push(`<span class="spec">${IC.bath} ${l.bathrooms} น้ำ</span>`);
  if (Number(l.area_sqm) > 0) specs.push(`<span class="spec">${IC.ruler} ${Number(l.area_sqm)} ตร.ม.</span>`);
  if (Number(l.land_area_sqwah) > 0) specs.push(`<span class="spec">${IC.land} ${Number(l.land_area_sqwah)} ตร.ว.</span>`);
  if (l.floor_text) specs.push(`<span class="spec">${IC.stairs} ชั้น ${esc(l.floor_text)}</span>`);

  const nearby = (l.nearby || []).slice(0, 2).map(n =>
    `<div class="nb"><span class="pill">ใกล้</span>${esc(n.label)} <span style="opacity:.7">(${esc(n.dist)})</span></div>`).join('');

  const catIco = IC[CAT_ICON[l.category] || 'home'];
  return `
    <a class="card" href="/listing/${l.id}">
      <div class="thumb">
        ${img ? `<img src="${esc(img)}" alt="${esc(l.title)}" loading="lazy">` : ''}
        <button class="fav-btn" data-fav="${l.id}" type="button" aria-label="บันทึกรายการโปรด">${IC.heart}</button>
        <span class="badge-type ${l.listing_type}">${catIco} ${TYPE_LABEL[l.listing_type] || ''}${CAT_LABEL[l.category] ? ' · ' + CAT_LABEL[l.category] : ''}</span>
        <span class="price-tag">
          <span class="p">${fmtPrice(l.price, l.listing_type)}</span>
          ${l.listing_type === 'rent' ? '<span class="per">/เดือน</span>' : ''}
        </span>
      </div>
      <div class="body">
        <h3>${esc(l.title)}</h3>
        <div class="loc">${IC.pin} ${esc(l.location_text || l.province || '-')}</div>
        <div class="spec-row">${specs.join('')}</div>
        ${nearby ? `<div class="nearby-row">${nearby}</div>` : ''}
      </div>
    </a>`;
}

// ---------- โครง HTML เต็มหน้า (ใช้ chrome เดียวกับทั้งเว็บผ่าน shared.js) ----------
function pageShell({ title, description, canonical, ogImage, robots, headExtra, main, active, baseUrl }) {
  const url = canonical || '';
  return `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script>(function(){try{var d=document.documentElement,t=localStorage.getItem("yj_theme");d.dataset.theme=t==="dark"?"dark":"light";var l=localStorage.getItem("yj_lang");d.lang=l==="en"?"en":"th";d.dataset.lang=d.lang;}catch(e){}})();</script>
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  ${robots ? `<meta name="robots" content="${esc(robots)}">` : ''}
  ${url ? `<link rel="canonical" href="${esc(url)}">` : ''}
  <meta property="og:type" content="website">
  <meta property="og:locale" content="th_TH">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  ${url ? `<meta property="og:url" content="${esc(url)}">` : ''}
  ${ogImage ? `<meta property="og:image" content="${esc(ogImage)}">` : ''}
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@400;500;600;700&family=IBM+Plex+Sans+Thai:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/style.css?v=35">
  <link rel="icon" href="/favicon">
  ${headExtra || ''}
</head>
<body>
  <div id="nav"></div>
  ${main}
  <div id="footer"></div>
  <script src="/js/shared.js?v=35"></script>
  <script>
    TD.chrome(${JSON.stringify(active || '')});
    document.querySelectorAll('[data-fav]').forEach(function(b){
      try { if (TD.favs().includes(Number(b.dataset.fav))) b.classList.add('on'); } catch(e){}
    });
  </script>
</body>
</html>`;
}

// ---------- JSON-LD ----------
const ld = (obj) => `<script type="application/ld+json">${jesc(JSON.stringify(obj))}</script>`;

function breadcrumbLd(items, baseUrl) {
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem', position: i + 1, name: it.name,
      item: it.url ? baseUrl + it.url : undefined
    }))
  };
}

function homeLd(baseUrl, brand) {
  return [
    ld({
      '@context': 'https://schema.org', '@type': 'WebSite',
      name: brand, url: baseUrl + '/',
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: baseUrl + '/search?q={search_term_string}' },
        'query-input': 'required name=search_term_string'
      }
    }),
    ld({
      '@context': 'https://schema.org', '@type': 'RealEstateAgent',
      name: brand, url: baseUrl + '/', image: baseUrl + '/favicon',
      areaServed: 'TH', priceRange: '฿฿'
    })
  ].join('');
}

function listingLd(l, baseUrl) {
  const url = `${baseUrl}/listing/${l.id}`;
  const price = Number(l.price) || 0;
  const offer = {
    '@type': 'Offer', priceCurrency: 'THB', price: price,
    availability: 'https://schema.org/InStock', url,
    ...(l.listing_type === 'rent' ? { businessFunction: 'http://purl.org/goodrelations/v1#LeaseOut' } : {})
  };
  const product = {
    '@context': 'https://schema.org', '@type': 'Product',
    name: l.title, url,
    ...(l.description ? { description: String(l.description).slice(0, 300) } : {}),
    ...((l.images || []).length ? { image: l.images.slice(0, 6) } : {}),
    ...(l.province ? { category: `${CAT_LABEL[l.category] || ''} ${l.province}`.trim() } : {}),
    offers: offer
  };
  const crumb = breadcrumbLd([
    { name: 'หน้าแรก', url: '/' },
    ...(l.province ? [{ name: l.province, url: areaUrl(l.province) }] : []),
    { name: l.title }
  ], baseUrl);
  return ld(product) + ld(crumb);
}

// ---------- เนื้อหา intro ที่ไม่ซ้ำ (data-driven, ไม่ใช้ AI) ----------
function headingLabel(type, category) {
  const t = TYPE_LABEL[type];
  const c = CAT_LABEL[category];
  if (c && t) return `${c}${t}`;              // คอนโดเช่า
  if (c) return c;                             // คอนโด
  if (t) return `บ้าน/คอนโด${t}`;              // บ้าน/คอนโดเช่า
  return 'อสังหาริมทรัพย์';
}

function buildIntro({ location, type, category, count, stats }) {
  const label = headingLabel(type, category);
  const parts = [];
  let price = '';
  if (type === 'rent' && stats.rentMin != null) price = ` ค่าเช่าเริ่มต้น ${fmtPrice(stats.rentMin, 'rent')}/เดือน`;
  else if (type === 'sale' && stats.saleMin != null) price = ` ราคาเริ่มต้น ${fmtPrice(stats.saleMin, 'sale')}`;
  else {
    const bits = [];
    if (stats.rentMin != null) bits.push(`เช่าเริ่มต้น ${fmtPrice(stats.rentMin, 'rent')}/เดือน`);
    if (stats.saleMin != null) bits.push(`ขายเริ่มต้น ${fmtPrice(stats.saleMin, 'sale')}`);
    if (bits.length) price = ` (${bits.join(' · ')})`;
  }
  parts.push(`รวม${label}ใน${location} ${count} รายการ${price} คัดมาให้เลือกครบในที่เดียว`);

  const catsHere = CATS.filter(c => stats.cats[c]);
  if (!category && catsHere.length > 1) {
    parts.push(`มีให้เลือกทั้ง ${catsHere.map(c => CAT_LABEL[c]).join(' ')} ตามงบและไลฟ์สไตล์ของคุณ`);
  }
  parts.push(`ทุกประกาศมีข้อมูลครบ รูปจริง แผนที่ทำเล และช่องทางติดต่อเจ้าของโดยตรง — เลือกดูรายละเอียดแล้วสอบถามได้ทันที`);
  return parts.join(' ');
}

// ---------- หน้าทำเล (area landing) ----------
function renderAreaPage({ location, type, category, listings, stats, provinces, baseUrl }) {
  const label = headingLabel(type, category);
  const count = listings.length;
  const canonical = baseUrl + areaUrl(location, type, category);
  const h1 = `${label}ใน${location}`;
  const title = `${h1}${count ? ` (${count} รายการ)` : ''} | ${stats.brand}`;
  const intro = count
    ? buildIntro({ location, type, category, count, stats })
    : `ยังไม่มี${label}ใน${location}ในขณะนี้ ลองดูทำเลใกล้เคียงหรือหมวดอื่น ๆ ด้านล่าง`;
  const desc = intro.slice(0, 155);
  const ogImage = (listings[0]?.images || [])[0] || '';

  // Breadcrumb (แสดงผล)
  const crumbs = [{ name: 'หน้าแรก', url: '/' }, { name: 'ทำเล', url: '/areas' }, { name: location, url: areaUrl(location) }];
  if (type) crumbs.push({ name: TYPE_LABEL[type], url: areaUrl(location, type) });
  if (category) crumbs.push({ name: CAT_LABEL[category], url: areaUrl(location, type, category) });
  const crumbHtml = `<nav class="breadcrumb" aria-label="breadcrumb">${crumbs.map((c, i) =>
    i < crumbs.length - 1 ? `<a href="${c.url}">${esc(c.name)}</a> <span class="sep">›</span> ` : `<span>${esc(c.name)}</span>`
  ).join('')}</nav>`;

  // ชิปกรองภายในทำเล (type + category ที่มีจริง)
  const typeChips = TYPES.filter(t => stats.types[t]).map(t =>
    `<a class="area-chip ${type === t ? 'on' : ''}" href="${areaUrl(location, t, category)}">${TYPE_LABEL[t]} (${stats.types[t]})</a>`).join('');
  const catChips = CATS.filter(c => stats.cats[c]).map(c =>
    `<a class="area-chip ${category === c ? 'on' : ''}" href="${areaUrl(location, type, c === category ? undefined : c)}">${CAT_LABEL[c]} (${stats.cats[c]})</a>`).join('');
  const clearChip = (type || category)
    ? `<a class="area-chip clear" href="${areaUrl(location)}">✕ ล้างตัวกรอง</a>` : '';

  // การ์ด
  const grid = count
    ? `<div class="grid cards">${listings.map(cardHtml).join('')}</div>`
    : `<div class="empty-area"><p>ไม่พบประกาศที่ตรงเงื่อนไขในทำเลนี้</p><a class="btn" href="${areaUrl(location)}">ดูทั้งหมดใน${esc(location)}</a></div>`;

  // ลิงก์ทำเลอื่น (internal linking)
  const others = provinces.filter(p => p.province !== location).slice(0, 12);
  const areaLinks = others.length ? `
    <section class="area-more">
      <h2>ทำเลยอดนิยมอื่น ๆ</h2>
      <div class="area-links">${others.map(p =>
        `<a href="${areaUrl(p.province)}">${esc(p.province)} <span>(${p.count})</span></a>`).join('')}
        <a class="all" href="/areas">ดูทำเลทั้งหมด ${IC.arrowRight}</a>
      </div>
    </section>` : '';

  const main = `
  <main class="container area-page">
    ${crumbHtml}
    <header class="area-head">
      <h1>${esc(h1)}</h1>
      <p class="area-sub">${esc(intro)}</p>
      ${(typeChips || catChips) ? `<div class="area-filters">${typeChips}${catChips ? `<span class="chip-div"></span>${catChips}` : ''}${clearChip}</div>` : ''}
    </header>
    ${grid}
    ${areaLinks}
  </main>`;

  // JSON-LD: CollectionPage + ItemList + Breadcrumb
  const itemList = {
    '@context': 'https://schema.org', '@type': 'ItemList', name: h1,
    numberOfItems: count,
    itemListElement: listings.slice(0, 20).map((l, i) => ({
      '@type': 'ListItem', position: i + 1, url: `${baseUrl}/listing/${l.id}`, name: l.title
    }))
  };
  const collection = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: title, description: desc, url: canonical };
  const headExtra = ld(collection) + ld(itemList) + ld(breadcrumbLd(crumbs, baseUrl));

  return pageShell({
    title, description: desc, canonical, ogImage,
    robots: count ? 'index,follow' : 'noindex,follow',
    headExtra, main, active: type || (category === 'land' ? 'land' : ''), baseUrl
  });
}

// ---------- หน้ารวมทำเลทั้งหมด (/areas) ----------
function renderAreasIndex({ provinces, baseUrl, brand }) {
  const canonical = baseUrl + '/areas';
  const title = `ค้นหาอสังหาฯ ตามทำเล — ทุกจังหวัด | ${brand}`;
  const desc = `เลือกดูบ้านเช่า บ้านขาย และที่ดินตามทำเลที่ต้องการ รวมทุกจังหวัดที่มีประกาศ พร้อมจำนวนรายการล่าสุด`;
  const tiles = provinces.map(p => `
    <a class="area-tile" href="${areaUrl(p.province)}">
      <div><h3>${esc(p.province)}</h3><span class="cnt">${p.count} ประกาศ</span></div>
      <span class="arrow">${IC.arrowRight}</span>
    </a>`).join('');
  const main = `
  <main class="container area-page">
    <nav class="breadcrumb" aria-label="breadcrumb"><a href="/">หน้าแรก</a> <span class="sep">›</span> <span>ทำเลทั้งหมด</span></nav>
    <header class="area-head">
      <h1>ค้นหาตามทำเล</h1>
      <p class="area-sub">เลือกจังหวัด/ทำเลที่สนใจ เพื่อดูบ้านเช่า บ้านขาย และที่ดินทั้งหมดในพื้นที่นั้น พร้อมข้อมูลครบและติดต่อเจ้าของได้ทันที</p>
    </header>
    ${provinces.length ? `<div class="area-grid">${tiles}</div>` : '<p>ยังไม่มีประกาศในระบบ</p>'}
  </main>`;
  const crumbLd = breadcrumbLd([{ name: 'หน้าแรก', url: '/' }, { name: 'ทำเลทั้งหมด', url: '/areas' }], baseUrl);
  return pageShell({
    title, description: desc, canonical,
    robots: provinces.length ? 'index,follow' : 'noindex,follow',
    headExtra: ld(crumbLd), main, active: '', baseUrl
  });
}

module.exports = {
  CATS, TYPES, CAT_LABEL, TYPE_LABEL,
  esc, areaUrl, renderAreaPage, renderAreasIndex,
  homeLd, listingLd, ld
};
