// db.js — PostgreSQL connection + auto-migrate + seed
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://teedee:teedee@localhost:5432/teedee';

const pool = new Pool({
  connectionString,
  ssl: process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost')
    ? { rejectUnauthorized: false }
    : false
});

async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS listings (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      listing_type TEXT NOT NULL DEFAULT 'rent',          -- rent | sale
      category TEXT NOT NULL DEFAULT 'condo',             -- house | condo | townhouse | land | commercial
      price BIGINT NOT NULL DEFAULT 0,                    -- บาท (เช่า = ต่อเดือน)
      location_text TEXT DEFAULT '',                      -- เช่น "พญาไท, กรุงเทพฯ"
      province TEXT DEFAULT '',
      bedrooms INT DEFAULT 0,
      bathrooms INT DEFAULT 0,
      area_sqm NUMERIC DEFAULT 0,                         -- พื้นที่ใช้สอย ตร.ม.
      land_area_sqwah NUMERIC DEFAULT 0,                  -- ที่ดิน ตร.ว.
      floor_text TEXT DEFAULT '',
      description TEXT DEFAULT '',
      highlights JSONB DEFAULT '[]',                      -- ["ใกล้ BTS", ...]
      images JSONB DEFAULT '[]',                          -- ["https://...", ...]
      nearby JSONB DEFAULT '[]',                          -- [{"label":"BTS พญาไท","dist":"440 ม."}]
      pets_allowed BOOLEAN DEFAULT false,
      featured BOOLEAN DEFAULT false,
      status TEXT DEFAULT 'active',                       -- active | draft | closed
      contact_line TEXT DEFAULT '',
      contact_phone TEXT DEFAULT '',
      views INT DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS inquiries (
      id SERIAL PRIMARY KEY,
      listing_id INT REFERENCES listings(id) ON DELETE SET NULL,
      name TEXT NOT NULL,
      phone TEXT DEFAULT '',
      line_id TEXT DEFAULT '',
      message TEXT DEFAULT '',
      is_read BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE INDEX IF NOT EXISTS idx_listings_search
      ON listings (status, listing_type, category, price);

    ALTER TABLE listings ADD COLUMN IF NOT EXISTS latitude NUMERIC;
    ALTER TABLE listings ADD COLUMN IF NOT EXISTS longitude NUMERIC;

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL DEFAULT ''
    );
  `);

  // ค่าเริ่มต้นของแบรนด์ (แก้ได้ในหลังบ้าน)
  await pool.query(`
    INSERT INTO settings (key, value) VALUES
      ('site_name_main', 'อยู่'),
      ('site_name_accent', 'ใจ'),
      ('site_subtitle', 'yoojai.com'),
      ('logo_url', '')
    ON CONFLICT (key) DO NOTHING;
  `);
}

const U = (id, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

const SEED = [
  {
    title: 'คอนโด 1 ห้องนอน วิวเมือง ใกล้ BTS พญาไท', listing_type: 'rent', category: 'condo',
    price: 25000, location_text: 'พญาไท, กรุงเทพฯ', province: 'กรุงเทพมหานคร',
    bedrooms: 1, bathrooms: 1, area_sqm: 29, floor_text: '18',
    description: 'ห้องแต่งครบสไตล์มินิมอล เฟอร์นิเจอร์บิวท์อิน เครื่องใช้ไฟฟ้าครบ พร้อมเข้าอยู่ทันที เดินถึง BTS พญาไท และ Airport Rail Link สะดวกทั้งทำงานในเมืองและเดินทางไปสนามบิน',
    highlights: ['เฟอร์นิเจอร์ครบ พร้อมอยู่', 'สระว่ายน้ำ + ฟิตเนส', 'เดินถึง BTS 5 นาที'],
    images: [U('photo-1522708323590-d24dbb6b0267'), U('photo-1502672260266-1c1ef2d93688'), U('photo-1560448204-e02f11c3d0e2')],
    nearby: [{ label: 'BTS พญาไท', dist: '440 ม.' }, { label: 'ARL พญาไท', dist: '500 ม.' }],
    pets_allowed: false, featured: true
  },
  {
    title: 'คอนโด 2 ห้องนอน มุมห้อง วิวสวน อนุสาวรีย์ชัยฯ', listing_type: 'rent', category: 'condo',
    price: 43000, location_text: 'ราชเทวี, กรุงเทพฯ', province: 'กรุงเทพมหานคร',
    bedrooms: 2, bathrooms: 2, area_sqm: 48, floor_text: '21',
    description: 'ห้องมุมรับแสงสองด้าน โปร่งสบาย ครัวปิดพร้อมเครื่องดูดควัน เหมาะกับครอบครัวเล็กหรือคู่ที่ทำงานในเมือง ส่วนกลางครบทั้งสระ ฟิตเนส และ co-working',
    highlights: ['ห้องมุม แสงธรรมชาติดี', 'ครัวปิด', 'Co-working ในตึก'],
    images: [U('photo-1493809842364-78817add7ffb'), U('photo-1484154218962-a197022b5858'), U('photo-1556912167-f556f1f39fdf')],
    nearby: [{ label: 'BTS อนุสาวรีย์ชัยฯ', dist: '350 ม.' }],
    pets_allowed: false, featured: true
  },
  {
    title: 'บ้านเดี่ยว 2 ชั้น 3 ห้องนอน หมู่บ้านสงบ ศาลายา', listing_type: 'sale', category: 'house',
    price: 4590000, location_text: 'ศาลายา, นครปฐม', province: 'นครปฐม',
    bedrooms: 3, bathrooms: 3, area_sqm: 160, land_area_sqwah: 52,
    description: 'บ้านเดี่ยวโครงการคุณภาพ ใกล้ ม.มหิดล ศาลายา ต่อเติมครัวไทยหลังบ้าน จอดรถได้ 2 คัน สังคมดี รปภ. 24 ชม. เดินทางเข้าเมืองสะดวกผ่านถนนบรมราชชนนี',
    highlights: ['ต่อเติมครัวไทยแล้ว', 'จอดรถ 2 คัน', 'ใกล้ ม.มหิดล'],
    images: [U('photo-1600596542815-ffad4c1539a9'), U('photo-1600585154340-be6161a56a0c'), U('photo-1600607687939-ce8a6c25118c')],
    nearby: [{ label: 'ม.มหิดล ศาลายา', dist: '2.5 กม.' }, { label: 'Central ศาลายา', dist: '3 กม.' }],
    pets_allowed: true, featured: true
  },
  {
    title: 'ทาวน์โฮม 3 ชั้น สไตล์ลอฟท์ ใกล้ MRT ห้วยขวาง', listing_type: 'rent', category: 'townhouse',
    price: 35000, location_text: 'ห้วยขวาง, กรุงเทพฯ', province: 'กรุงเทพมหานคร',
    bedrooms: 3, bathrooms: 3, area_sqm: 180,
    description: 'ทาวน์โฮมรีโนเวทใหม่ทั้งหลัง สไตล์ลอฟท์ปูนเปลือย เหมาะทั้งอยู่อาศัยและทำโฮมออฟฟิศ จดทะเบียนบริษัทได้ ที่จอดรถหน้าบ้าน 1 คัน',
    highlights: ['รีโนเวทใหม่ทั้งหลัง', 'ทำโฮมออฟฟิศได้', 'เลี้ยงสัตว์ได้'],
    images: [U('photo-1600566753086-00f18fb6b3ea'), U('photo-1600210492486-724fe5c67fb0'), U('photo-1600566752355-35792bedcfea')],
    nearby: [{ label: 'MRT ห้วยขวาง', dist: '600 ม.' }],
    pets_allowed: true, featured: false
  },
  {
    title: 'ที่ดินเปล่า 200 ตร.ว. ติดถนน ใกล้ตัวเมืองนครปฐม', listing_type: 'sale', category: 'land',
    price: 3200000, location_text: 'เมืองนครปฐม, นครปฐม', province: 'นครปฐม',
    land_area_sqwah: 200,
    description: 'ที่ดินถมแล้ว หน้ากว้าง 20 เมตร ติดถนนคอนกรีต น้ำไฟพร้อม ห่างองค์พระปฐมเจดีย์เพียง 10 นาที เหมาะปลูกบ้านหรือทำการค้า โฉนดพร้อมโอน',
    highlights: ['ถมแล้ว พร้อมปลูกสร้าง', 'หน้ากว้าง 20 ม.', 'โฉนดพร้อมโอน'],
    images: [U('photo-1500382017468-9049fed747ef'), U('photo-1628744448840-55bdb2497bd4')],
    nearby: [{ label: 'องค์พระปฐมเจดีย์', dist: '4 กม.' }],
    pets_allowed: true, featured: true
  },
  {
    title: 'ที่ดินสวนผลไม้ 2 ไร่ ให้เช่าระยะยาว สามพราน', listing_type: 'rent', category: 'land',
    price: 15000, location_text: 'สามพราน, นครปฐม', province: 'นครปฐม',
    land_area_sqwah: 800,
    description: 'ที่ดินพร้อมสวนผลไม้เดิม ติดคลองชลประทาน เหมาะทำเกษตร คาเฟ่สวน หรือฟาร์มสเตย์ สัญญาเช่าขั้นต่ำ 3 ปี ต่อรองได้',
    highlights: ['ติดคลองชลประทาน', 'สัญญายาว 3 ปีขึ้นไป', 'เหมาะทำคาเฟ่/ฟาร์มสเตย์'],
    images: [U('photo-1464226184884-fa280b87c399'), U('photo-1500076656116-558758c991c1')],
    nearby: [{ label: 'ตลาดน้ำดอนหวาย', dist: '5 กม.' }],
    pets_allowed: true, featured: false
  },
  {
    title: 'คอนโด Studio ตกแต่งใหม่ ใกล้ BTS อ่อนนุช', listing_type: 'rent', category: 'condo',
    price: 12000, location_text: 'อ่อนนุช, กรุงเทพฯ', province: 'กรุงเทพมหานคร',
    bedrooms: 0, bathrooms: 1, area_sqm: 24, floor_text: '7',
    description: 'ห้องสตูดิโอตกแต่งใหม่ โทนอบอุ่น เครื่องซักผ้าในห้อง ตึกมีร้านสะดวกซื้อชั้นล่าง เดิน 6 นาทีถึง BTS อ่อนนุช ราคานี้รวมค่าส่วนกลางแล้ว',
    highlights: ['เครื่องซักผ้าในห้อง', 'รวมค่าส่วนกลาง', '7-Eleven ชั้นล่าง'],
    images: [U('photo-1536376072261-38c75010e6c9'), U('photo-1554995207-c18c203602cb')],
    nearby: [{ label: 'BTS อ่อนนุช', dist: '450 ม.' }],
    pets_allowed: false, featured: false
  },
  {
    title: 'บ้านเดี่ยวชั้นเดียว พร้อมสวน ให้เช่า เชียงใหม่', listing_type: 'rent', category: 'house',
    price: 18000, location_text: 'หางดง, เชียงใหม่', province: 'เชียงใหม่',
    bedrooms: 2, bathrooms: 2, area_sqm: 120, land_area_sqwah: 80,
    description: 'บ้านชั้นเดียวสไตล์มูจิ สวนหญ้าหน้าบ้านกว้าง บรรยากาศเงียบสงบ วิวดอยสุเทพ เหมาะกับ digital nomad หรือครอบครัวที่อยากได้อากาศดี ๆ',
    highlights: ['วิวดอยสุเทพ', 'สวนกว้าง เลี้ยงสัตว์ได้', 'เน็ตไฟเบอร์พร้อม'],
    images: [U('photo-1512917774080-9991f1c4c750'), U('photo-1600047509807-ba8f99d2cdde')],
    nearby: [{ label: 'กาดฝรั่ง หางดง', dist: '3 กม.' }],
    pets_allowed: true, featured: true
  },
  {
    title: 'คอนโดหรู 2 ห้องนอน วิวแม่น้ำ เจริญนคร', listing_type: 'sale', category: 'condo',
    price: 8900000, location_text: 'คลองสาน, กรุงเทพฯ', province: 'กรุงเทพมหานคร',
    bedrooms: 2, bathrooms: 2, area_sqm: 62, floor_text: '30',
    description: 'ห้องวิวแม่น้ำเจ้าพระยาเต็มตา ชั้นสูง เฟอร์นิเจอร์ built-in ครบ ใกล้ ICONSIAM และ BTS สายสีทอง ผู้อยู่อาศัยคุณภาพ นิติบุคคลดูแลดีมาก',
    highlights: ['วิวแม่น้ำเจ้าพระยา', 'ใกล้ ICONSIAM', 'ชั้น 30'],
    images: [U('photo-1567496898669-ee935f5f647a'), U('photo-1512918728675-ed5a9ecdebfd'), U('photo-1615873968403-89e068629265')],
    nearby: [{ label: 'BTS เจริญนคร', dist: '300 ม.' }, { label: 'ICONSIAM', dist: '600 ม.' }],
    pets_allowed: false, featured: true
  },
  {
    title: 'ทาวน์เฮาส์ 2 ชั้น มือสองสภาพดี บางใหญ่', listing_type: 'sale', category: 'townhouse',
    price: 2390000, location_text: 'บางใหญ่, นนทบุรี', province: 'นนทบุรี',
    bedrooms: 3, bathrooms: 2, area_sqm: 110, land_area_sqwah: 18,
    description: 'ทาวน์เฮาส์รีโนเวทพร้อมอยู่ ทาสีใหม่ทั้งหลัง เปลี่ยนหลังคาและระบบไฟแล้ว ใกล้ MRT สายสีม่วง และ Central WestGate ผ่อนถูกกว่าเช่า',
    highlights: ['รีโนเวทแล้ว พร้อมโอน', 'ใกล้ MRT สายสีม่วง', 'ฟรีค่าโอน'],
    images: [U('photo-1580587771525-78b9dba3b914'), U('photo-1576941089067-2de3c901e126')],
    nearby: [{ label: 'MRT คลองบางไผ่', dist: '1.2 กม.' }, { label: 'Central WestGate', dist: '2 กม.' }],
    pets_allowed: true, featured: false
  },
  {
    title: 'อาคารพาณิชย์ 3 ชั้น ทำเลค้าขาย ตลาดพระประโทน', listing_type: 'sale', category: 'commercial',
    price: 5500000, location_text: 'เมืองนครปฐม, นครปฐม', province: 'นครปฐม',
    bedrooms: 2, bathrooms: 3, area_sqm: 240, land_area_sqwah: 20,
    description: 'อาคารพาณิชย์ติดถนนเพชรเกษม หน้าตลาด คนพลุกพล่านตลอดวัน ชั้นล่างเคยเป็นร้านทอง โครงสร้างแข็งแรง เหมาะทำร้านค้า คลินิก หรือออฟฟิศ',
    highlights: ['ติดถนนเพชรเกษม', 'หน้าตลาด ทำเลทอง', 'โครงสร้างพร้อมใช้'],
    images: [U('photo-1486406146926-c627a92ad1ab'), U('photo-1449824913935-59a10b8d2000')],
    nearby: [{ label: 'ตลาดพระประโทน', dist: '50 ม.' }],
    pets_allowed: true, featured: false
  },
  {
    title: 'บ้านพูลวิลล่า 4 ห้องนอน ให้เช่ารายเดือน หัวหิน', listing_type: 'rent', category: 'house',
    price: 65000, location_text: 'หัวหิน, ประจวบคีรีขันธ์', province: 'ประจวบคีรีขันธ์',
    bedrooms: 4, bathrooms: 4, area_sqm: 280, land_area_sqwah: 100,
    description: 'พูลวิลล่าส่วนตัวสไตล์โมเดิร์นทรอปิคอล สระว่ายน้ำระบบเกลือ ห่างหาดหัวหินเพียง 5 นาที เฟอร์นิเจอร์และเครื่องครัวครบ เหมาะอยู่ยาวหรือทำงานทางไกล',
    highlights: ['สระส่วนตัวระบบเกลือ', 'ใกล้หาด 5 นาที', 'ครัวครบ พร้อมอยู่'],
    images: [U('photo-1613490493576-7fde63acd811'), U('photo-1613977257363-707ba9348227'), U('photo-1602343168117-bb8ffe3e2e9f')],
    nearby: [{ label: 'หาดหัวหิน', dist: '2 กม.' }, { label: 'ตลาดฉัตรไชย', dist: '3 กม.' }],
    pets_allowed: true, featured: true
  },
  {
    title: 'ที่ดินแปลงสวย 1 ไร่ โซนบ้านฉาง ใกล้อู่ตะเภา', listing_type: 'sale', category: 'land',
    price: 4800000, location_text: 'บ้านฉาง, ระยอง', province: 'ระยอง',
    land_area_sqwah: 400,
    description: 'ที่ดินในโซน EEC ห่างสนามบินอู่ตะเภา 15 นาที ผังเมืองสีเหลือง ปลูกสร้างที่อยู่อาศัยได้ ราคายังไม่ขึ้นตามโครงการรถไฟความเร็วสูง เหมาะถือลงทุนระยะยาว',
    highlights: ['โซน EEC ศักยภาพสูง', 'ใกล้สนามบินอู่ตะเภา', 'เหมาะลงทุนระยะยาว'],
    images: [U('photo-1500530855697-b586d89ba3ee'), U('photo-1441974231531-c6227db76b6e')],
    nearby: [{ label: 'สนามบินอู่ตะเภา', dist: '12 กม.' }],
    pets_allowed: true, featured: false
  }
];

async function seed() {
  const { rows } = await pool.query('SELECT COUNT(*)::int AS c FROM listings');
  if (rows[0].c > 0) return;
  for (const s of SEED) {
    await pool.query(
      `INSERT INTO listings
        (title, listing_type, category, price, location_text, province, bedrooms, bathrooms,
         area_sqm, land_area_sqwah, floor_text, description, highlights, images, nearby,
         pets_allowed, featured, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,'active')`,
      [s.title, s.listing_type, s.category, s.price, s.location_text, s.province,
       s.bedrooms || 0, s.bathrooms || 0, s.area_sqm || 0, s.land_area_sqwah || 0,
       s.floor_text || '', s.description, JSON.stringify(s.highlights || []),
       JSON.stringify(s.images || []), JSON.stringify(s.nearby || []),
       !!s.pets_allowed, !!s.featured]
    );
  }
  console.log(`Seeded ${SEED.length} listings`);
}

module.exports = { pool, migrate, seed };
