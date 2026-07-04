// shared.js — helpers + Tabler inline SVG icons + card renderer
const TD = {
  icons: {
    home: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l-2 0l9 -9l9 9l-2 0"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"/><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"/></svg>',
    building: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21l18 0"/><path d="M9 8l1 0"/><path d="M9 12l1 0"/><path d="M9 16l1 0"/><path d="M14 8l1 0"/><path d="M14 12l1 0"/><path d="M14 16l1 0"/><path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16"/></svg>',
    townhouse: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21v-13l9 -4l9 4v13"/><path d="M13 13h4v8h-10v-6h6"/><path d="M13 21v-9a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v3"/></svg>',
    land: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 18.5l-3 -1.5l-6 3v-13l6 -3l6 3l6 -3v7.5"/><path d="M9 4v13"/><path d="M15 7v5.5"/><path d="M21.121 20.121a3 3 0 1 0 -4.242 0c.418 .419 1.125 1.045 2.121 1.879c1.051 -.89 1.759 -1.516 2.121 -1.879z"/><path d="M19 18v.01"/></svg>',
    store: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21l18 0"/><path d="M3 7v1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1h-18l2 -4h14l2 4"/><path d="M5 21l0 -10.15"/><path d="M19 21l0 -10.15"/><path d="M9 21v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4"/></svg>',
    search: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"/><path d="M21 21l-6 -6"/></svg>',
    pin: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"/><path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"/></svg>',
    bed: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v11m0 -4h18m0 4v-8a2 2 0 0 0 -2 -2h-8v6"/><path d="M7 10m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/></svg>',
    bath: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4v-3a1 1 0 0 1 1 -1z"/><path d="M6 12v-7a2 2 0 0 1 2 -2h3v2.25"/><path d="M4 21l1 -1.5"/><path d="M20 21l-1 -1.5"/></svg>',
    ruler: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h14a1 1 0 0 1 1 1v5a1 1 0 0 1 -1 1h-7a1 1 0 0 0 -1 1v7a1 1 0 0 1 -1 1h-5a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1"/><path d="M4 8l2 0"/><path d="M4 12l3 0"/><path d="M4 16l2 0"/><path d="M8 4l0 2"/><path d="M12 4l0 3"/><path d="M16 4l0 2"/></svg>',
    stairs: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4v-4h4v-4h4v-4h4"/></svg>',
    paw: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 13.5c-1.1 -2 -1.441 -2.5 -2.7 -2.5c-1.259 0 -1.736 .755 -2.836 2.747c-.942 1.703 -2.846 1.845 -3.321 3.291c-.097 .265 -.145 .677 -.143 .962c0 1.176 .787 2 1.8 2c1.259 0 3 -1 4.5 -1s3.241 1 4.5 1c1.013 0 1.8 -.823 1.8 -2c0 -.285 -.049 -.697 -.146 -.962c-.475 -1.451 -2.512 -1.587 -3.454 -3.538z"/><path d="M20.188 8.082a1.039 1.039 0 0 0 -.406 -.082h-.015c-.735 .012 -1.56 .75 -1.993 1.866c-.519 1.335 -.28 2.7 .538 3.052c.129 .055 .267 .082 .406 .082c.739 0 1.575 -.742 2.011 -1.866c.516 -1.335 .273 -2.7 -.54 -3.052z"/><path d="M9.474 9c.055 0 .109 0 .163 -.011c.944 -.128 1.533 -1.346 1.32 -2.722c-.203 -1.297 -1.047 -2.267 -1.932 -2.267c-.055 0 -.109 0 -.163 .011c-.944 .128 -1.533 1.346 -1.32 2.722c.204 1.293 1.048 2.267 1.933 2.267z"/><path d="M16.456 6.733c.214 -1.376 -.375 -2.594 -1.32 -2.722a1.164 1.164 0 0 0 -.162 -.011c-.885 0 -1.728 .97 -1.93 2.267c-.214 1.376 .375 2.594 1.32 2.722c.054 .007 .108 .011 .162 .011c.885 0 1.73 -.974 1.93 -2.267z"/><path d="M5.69 12.918c.816 -.352 1.054 -1.719 .536 -3.052c-.436 -1.124 -1.271 -1.866 -2.009 -1.866c-.14 0 -.277 .027 -.407 .082c-.816 .352 -1.054 1.719 -.536 3.052c.436 1.124 1.271 1.866 2.009 1.866c.14 0 .277 -.027 .407 -.082z"/></svg>',
    check: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5l10 -10"/></svg>',
    shield: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.46 20.846a12 12 0 0 1 -7.96 -14.846a12 12 0 0 0 8.5 -3a12 12 0 0 0 8.5 3a12 12 0 0 1 -.09 7.06"/><path d="M15 19l2 2l4 -4"/></svg>',
    sparkles: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z"/></svg>',
    arrowRight: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l14 0"/><path d="M13 18l6 -6"/><path d="M13 6l6 6"/></svg>',
    phone: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2"/></svg>',
    coin: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/><path d="M14.8 9a2 2 0 0 0 -1.8 -1h-2a2 2 0 1 0 0 4h2a2 2 0 1 1 0 4h-2a2 2 0 0 1 -1.8 -1"/><path d="M12 7v10"/></svg>',
    fileCheck: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/><path d="M9 15l2 2l4 -4"/></svg>',
    headset: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14v-3a8 8 0 1 1 16 0v3"/><path d="M18 19c0 1.657 -2.686 3 -6 3"/><path d="M4 14a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2 -2v-3z"/><path d="M15 14a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2 -2v-3z"/></svg>',
    mapSearch: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 18l-2 -1l-6 3v-13l6 -3l6 3l6 -3v7.5"/><path d="M9 4v13"/><path d="M15 7v5"/><path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><path d="M20.2 20.2l1.8 1.8"/></svg>',
    ban: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/><path d="M5.7 5.7l12.6 12.6"/></svg>',
    heart: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"/></svg>',
    share: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><path d="M18 6m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><path d="M8.7 10.7l6.6 -3.4"/><path d="M8.7 13.3l6.6 3.4"/></svg>',
    copy: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z"/><path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1"/></svg>',
    calc: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 3m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"/><path d="M8 7m0 1a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1z"/><path d="M8 14l0 .01"/><path d="M12 14l0 .01"/><path d="M16 14l0 .01"/><path d="M8 17l0 .01"/><path d="M12 17l0 .01"/><path d="M16 17l0 .01"/></svg>'
  },

  catLabel: { house: 'บ้านเดี่ยว', condo: 'คอนโด', townhouse: 'ทาวน์เฮาส์', land: 'ที่ดิน', commercial: 'อาคารพาณิชย์' },
  catIcon: { house: 'home', condo: 'building', townhouse: 'townhouse', land: 'land', commercial: 'store' },
  typeLabel: { rent: 'เช่า', sale: 'ขาย' },

  favs() {
    try { return JSON.parse(localStorage.getItem('teedee_favs') || '[]'); } catch { return []; }
  },
  toggleFav(id) {
    id = Number(id);
    let f = this.favs();
    f = f.includes(id) ? f.filter(x => x !== id) : [...f, id];
    localStorage.setItem('teedee_favs', JSON.stringify(f));
    return f.includes(id);
  },
  recent() {
    try { return JSON.parse(localStorage.getItem('teedee_recent') || '[]'); } catch { return []; }
  },
  pushRecent(id) {
    id = Number(id);
    const r = [id, ...this.recent().filter(x => x !== id)].slice(0, 8);
    localStorage.setItem('teedee_recent', JSON.stringify(r));
  },

  esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, m =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  },

  price(n, type) {
    const num = Number(n) || 0;
    if (type === 'sale' && num >= 1000000) {
      const m = num / 1000000;
      return `฿${m % 1 === 0 ? m : m.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')} ล้าน`;
    }
    return `฿${num.toLocaleString('th-TH')}`;
  },

  card(l) {
    const img = (l.images && l.images[0]) || '';
    const specs = [];
    if (l.bedrooms > 0) specs.push({ ic: 'bed', t: `${l.bedrooms} นอน` });
    if (l.bathrooms > 0) specs.push({ ic: 'bath', t: `${l.bathrooms} น้ำ` });
    if (Number(l.area_sqm) > 0) specs.push({ ic: 'ruler', t: `${Number(l.area_sqm)} ตร.ม.` });
    if (Number(l.land_area_sqwah) > 0) specs.push({ ic: 'land', t: `${Number(l.land_area_sqwah)} ตร.ว.` });
    if (l.floor_text) specs.push({ ic: 'stairs', t: `ชั้น ${this.esc(l.floor_text)}` });

    const nearby = (l.nearby || []).slice(0, 2).map(n =>
      `<div class="nb"><span class="pill">ใกล้</span>${this.esc(n.label)} <span style="opacity:.7">(${this.esc(n.dist)})</span></div>`).join('');

    const faved = this.favs().includes(Number(l.id));
    return `
    <a class="card" href="/listing/${l.id}">
      <div class="thumb">
        ${img ? `<img src="${this.esc(img)}" alt="${this.esc(l.title)}" loading="lazy">` : ''}
        <button class="fav-btn ${faved ? 'on' : ''}" data-fav="${l.id}" type="button" aria-label="บันทึกรายการโปรด">${this.icons.heart}</button>
        <span class="badge-type ${l.listing_type}">${this.icons[this.catIcon[l.category] || 'home']} ${this.typeLabel[l.listing_type] || ''}${this.catLabel[l.category] ? ' · ' + this.catLabel[l.category] : ''}</span>
        <span class="price-tag">
          <span class="p">${this.price(l.price, l.listing_type)}</span>
          ${l.listing_type === 'rent' ? '<span class="per">/เดือน</span>' : ''}
        </span>
      </div>
      <div class="body">
        <h3>${this.esc(l.title)}</h3>
        <div class="loc">${this.icons.pin} ${this.esc(l.location_text || l.province || '-')}</div>
        <div class="spec-row">${specs.map(s => `<span class="spec">${this.icons[s.ic]} ${s.t}</span>`).join('')}</div>
        ${nearby ? `<div class="nearby-row">${nearby}</div>` : ''}
      </div>
    </a>`;
  },

  navbar(active) {
    return `
    <div class="nav"><div class="container nav-inner">
      <a class="brand" href="/"><span class="mark">${this.icons.home}</span>Tee<em>Dee</em> <span class="sub-th">ที่ดี</span></a>
      <nav class="nav-links">
        <a href="/search?type=rent" class="${active === 'rent' ? 'on' : ''}">เช่า</a>
        <a href="/search?type=sale" class="${active === 'sale' ? 'on' : ''}">ซื้อ</a>
        <a href="/search?category=land" class="${active === 'land' ? 'on' : ''}">ที่ดิน</a>
        <a href="/#categories">ประเภททั้งหมด</a>
      </nav>
      <span class="nav-spacer"></span>
      <a class="icon-btn" href="/saved" aria-label="รายการโปรด" title="รายการโปรด">${this.icons.heart}</a>
      <a class="btn btn-ghost" href="/#list-cta" style="padding:9px 18px;font-size:.88rem">ลงประกาศ</a>
    </div></div>`;
  },

  footer() {
    return `
    <footer><div class="container">
      <div class="foot-inner">
        <div class="foot-brand">
          <a class="brand" href="/" style="color:#fff"><span class="mark">${this.icons.home}</span>Tee<em style="color:#d6b988">Dee</em></a>
          <p>แพลตฟอร์มอสังหาริมทรัพย์ที่รวมบ้านเช่า บ้านขาย และที่ดินไว้ในที่เดียว ค้นหาง่าย ข้อมูลครบ ติดต่อตรงถึงเจ้าของ</p>
        </div>
        <div><h4>ค้นหา</h4>
          <a href="/search?type=rent">บ้าน/คอนโดให้เช่า</a>
          <a href="/search?type=sale">บ้าน/คอนโดขาย</a>
          <a href="/search?category=land">ที่ดิน</a>
          <a href="/search?category=commercial">อาคารพาณิชย์</a>
        </div>
        <div><h4>ทำเลยอดนิยม</h4>
          <a href="/search?q=กรุงเทพ">กรุงเทพมหานคร</a>
          <a href="/search?q=นครปฐม">นครปฐม</a>
          <a href="/search?q=เชียงใหม่">เชียงใหม่</a>
          <a href="/search?q=หัวหิน">หัวหิน</a>
        </div>
        <div><h4>เมนูลัด</h4>
          <a href="/saved">รายการโปรดของฉัน</a>
          <a href="/#list-cta">ลงประกาศฟรี</a>
          <a href="/admin">เข้าสู่ระบบผู้ดูแล</a>
        </div>
      </div>
      <div class="foot-bottom">
        <span>© ${new Date().getFullYear()} TeeDee (ที่ดี) — All rights reserved</span>
        <span>ทำด้วยใจ เพื่อคนหาบ้าน 🏡</span>
      </div>
    </div></footer>`;
  },

  async post(url, body, token) {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(body)
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || 'เกิดข้อผิดพลาด');
    return j;
  }
};


// global: favorite toggle (ทำงานกับการ์ดทุกใบทุกหน้า)
if (typeof document !== 'undefined') {
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-fav]');
    if (!b) return;
    e.preventDefault(); e.stopPropagation();
    const on = TD.toggleFav(b.dataset.fav);
    b.classList.toggle('on', on);
    b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
  });
}
