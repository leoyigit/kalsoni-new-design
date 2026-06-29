/* ============================================================
   KALSONI — shared data layer (v2)
   Real catalog + merchant-feedback features.
   Exposes window.KALSONI used by every page.
   ============================================================ */
(function () {
  var CDN = 'https://images.squarespace-cdn.com/content/v1/6222be71457f4243db6467da/';

  var IMG = {
    hero:      CDN + '14a34175-8116-46df-a4be-b7dbea586440/IMG_7321.jpg?format=1800w',
    top1:      CDN + '1661660427715-FML5WDZWMD8YN328LUPJ/88D1A1C1-8773-47A9-861D-60BFC87189C0?format=1000w',
    top2:      CDN + '1661662705421-U809LZXBMMCR5AU9BCZG/A8ED9969-B6E3-4AF6-B0BC-ED23C00DB831?format=1000w',
    hijab1:    CDN + '1668674073405-FOXG21VMKKS87Z04C0F8/6-5958F52E-FA12-41A5-936C-6B4B7770EC11_1_105_c.jpg?format=1000w',
    jacket:    CDN + '1668674073500-MF888GBGYJKN4SU02W13/7-93006251-7B00-41AC-BE8B-A17C48802424_1_105_c.jpg?format=1000w',
    shawl:     CDN + '1668672307115-W1AEHD40WBXYK1YDPKOZ/Tula.jpeg?format=1000w',
    blue:      CDN + '1668673758927-R8S7VQXHXSDDV8I6GL25/2-1551C815-7784-4A04-9142-D1104AF696A1_1_105_c.jpg?format=1000w',
    twogirls:  CDN + 'a3f9e7ca-760e-4aba-a815-59cf0ebc9402/6531462D-B904-4E5A-BE38-FFF9ABFD35DD?format=1200w',
    confident: CDN + '1661928512610-HXXNX8A99W4LE10R6HD0/image.jpg?format=1000w'
  };

  // Colour swatches
  var BK = { name: 'Black',  hex: '#1b1b1b' },
      SD = { name: 'Sand',   hex: '#d8c7ad' },
      SL = { name: 'Slate',  hex: '#5b6470' },
      CL = { name: 'Clay',   hex: '#b26749' },
      OL = { name: 'Olive',  hex: '#6f7256' },
      IV = { name: 'Ivory',  hex: '#efe9dd' },
      ST = { name: 'Steel',  hex: '#5f7a8c' };

  var FULL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL'];

  // Build the 5-shot placeholder gallery (front, side, back, detail, flat-lay).
  // Real photography is TBD — these labelled slots let real assets drop straight in.
  function gallery(pool) {
    var labels = ['Front', 'Side', 'Back', 'Detail', 'Flat-lay'];
    return labels.map(function (label, i) { return { label: label, img: pool[i % pool.length] }; });
  }

  var products = [
    // ----- TOPS — The Biftu Collection -----
    {
      id: 'biftu-mid-tunic', name: 'Biftu Mid-Length Tunic', price: 78,
      category: 'tops', categoryLabel: 'TOPS', collection: 'The Biftu Collection',
      img: IMG.top1, gallery: gallery([IMG.top1, IMG.top2, IMG.confident, IMG.jacket]),
      colors: [BK, SD, SL, CL, OL], sizes: FULL_SIZES, soldOut: '5XL',
      rating: 4.9, reviewCount: 142, isNew: true, fabricTech: 'KalFlex',
      completeLook: ['wide-leg-pant', 'mako-sport-hijab'],
      blurb: 'Our signature mid-length tunic — a relaxed, fully-covering silhouette with side slits for easy movement. The cornerstone of the Biftu Collection, available in five core colours.',
      fabric: 'KalFlex — 88% recycled polyester, 12% elastane. Soft-touch, four-way stretch, breathable knit.'
    },
    {
      id: 'biftu-full-tunic', name: 'Biftu Full-Length Tunic', price: 88,
      category: 'tops', categoryLabel: 'TOPS', collection: 'The Biftu Collection',
      img: IMG.top2, gallery: gallery([IMG.top2, IMG.top1, IMG.twogirls, IMG.jacket]),
      colors: [BK, SD, SL, IV], sizes: FULL_SIZES, soldOut: '',
      rating: 4.8, reviewCount: 96, isNew: true, fabricTech: 'KalFlex',
      completeLook: ['joggers', 'safiya-sport-hijab'],
      blurb: 'Maximum coverage, zero compromise on movement. The full-length tunic drapes to mid-thigh with a high neck and thumbhole cuffs — modest, elegant and built to perform.',
      fabric: 'KalFlex — 88% recycled polyester, 12% elastane. Elegant drape, four-way stretch.'
    },
    // ----- BOTTOMS -----
    {
      id: 'wide-leg-pant', name: 'Wide Leg Pant', price: 68,
      category: 'bottoms', categoryLabel: 'BOTTOMS', collection: 'Performance Bottoms',
      img: IMG.confident, gallery: gallery([IMG.confident, IMG.twogirls, IMG.top1]),
      colors: [BK, SL], sizes: FULL_SIZES, soldOut: '',
      rating: 4.9, reviewCount: 188, isNew: false, fabricTech: 'KalFlex',
      completeLook: ['biftu-mid-tunic', 'mako-sport-shawl'],
      blurb: 'A flowing wide-leg trouser with a high, supportive waistband and full opacity. Studio-to-street coverage that moves like activewear and reads like everyday wear.',
      fabric: 'KalFlex — 76% recycled nylon, 24% elastane. Squat-proof, opaque, four-way stretch.'
    },
    {
      id: 'joggers', name: 'Joggers', price: 64,
      category: 'bottoms', categoryLabel: 'BOTTOMS', collection: 'Performance Bottoms',
      img: IMG.jacket, gallery: gallery([IMG.jacket, IMG.confident, IMG.twogirls]),
      colors: [BK, OL], sizes: FULL_SIZES, soldOut: 'XS',
      rating: 4.8, reviewCount: 121, isNew: false, fabricTech: 'BreezeLuxe',
      completeLook: ['biftu-full-tunic', 'mako-sport-hijab'],
      blurb: 'Tapered, cuffed joggers with a relaxed modest fit and deep side pockets. Lightweight enough to train in, soft enough to live in.',
      fabric: 'BreezeLuxe — 80% recycled nylon, 20% elastane. Lightweight, breathable, quick-dry.'
    },
    // ----- SPORT HIJABS & SHAWLS — The Performance Hijab Collection -----
    {
      id: 'safiya-sport-hijab', name: 'Safiya Sport Hijab', price: 38,
      category: 'hijabs-shawls', categoryLabel: 'SPORT HIJABS & SHAWLS', collection: 'The Performance Hijab Collection',
      img: IMG.blue, gallery: gallery([IMG.blue, IMG.hijab1, IMG.confident]),
      colors: [BK], sizes: ['S/M', 'L/XL'], soldOut: '',
      rating: 4.9, reviewCount: 214, isNew: true, fabricTech: 'BreezeLuxe',
      completeLook: ['biftu-full-tunic', 'wide-leg-pant'],
      blurb: 'The Safiya — our fitted, instant-on sport hijab. Engineered to stay put through every rep, sprint and stretch, with full coverage at the neckline. Available in two sizes for the perfect fit.',
      fabric: 'BreezeLuxe — 90% recycled polyester, 10% elastane. Moisture-wicking, four-way stretch, UPF 50+.'
    },
    {
      id: 'mako-sport-hijab', name: 'Mako Sport Hijab', price: 34,
      category: 'hijabs-shawls', categoryLabel: 'SPORT HIJABS & SHAWLS', collection: 'The Performance Hijab Collection',
      img: IMG.hijab1, gallery: gallery([IMG.hijab1, IMG.blue, IMG.top2]),
      colors: [BK, SD, ST], sizes: ['One Size'], soldOut: '',
      rating: 4.8, reviewCount: 167, isNew: true, fabricTech: 'BreezeLuxe',
      completeLook: ['biftu-mid-tunic', 'joggers'],
      blurb: 'The Mako — a lightweight, one-size sport hijab with an easy pull-on fit. Breathable, quick-drying and secure for high-intensity activity or all-day wear.',
      fabric: 'BreezeLuxe — 90% recycled polyester, 10% elastane. Quick-dry, anti-odour, breathable.'
    },
    {
      id: 'safiya-sport-shawl', name: 'Safiya Sport Shawl', price: 42,
      category: 'hijabs-shawls', categoryLabel: 'SPORT HIJABS & SHAWLS', collection: 'The Performance Hijab Collection',
      img: IMG.shawl, gallery: gallery([IMG.shawl, IMG.blue, IMG.confident]),
      colors: [BK, SL, CL], sizes: ['One Size'], soldOut: '',
      rating: 4.8, reviewCount: 88, isNew: false, fabricTech: 'SolShield',
      completeLook: ['biftu-full-tunic', 'wide-leg-pant'],
      blurb: 'A versatile performance shawl offering full coverage with an effortless drape. Quick-drying, lightweight and easy to restyle from workout to everyday.',
      fabric: 'SolShield — 90% recycled polyester, 10% elastane. UPF 50+, quick-dry, anti-odour.'
    },
    {
      id: 'mako-sport-shawl', name: 'Mako Sport Shawl', price: 40,
      category: 'hijabs-shawls', categoryLabel: 'SPORT HIJABS & SHAWLS', collection: 'The Performance Hijab Collection',
      img: IMG.shawl, gallery: gallery([IMG.shawl, IMG.hijab1, IMG.top2]),
      colors: [BK, SD, SL, CL], sizes: ['One Size'], soldOut: '',
      rating: 4.7, reviewCount: 74, isNew: false, fabricTech: 'SolShield',
      completeLook: ['biftu-mid-tunic', 'joggers'],
      blurb: 'The Mako shawl in four core colours — a draped, full-coverage layer that finishes any look. Soft, breathable and built for movement.',
      fabric: 'SolShield — 90% recycled polyester, 10% elastane. UPF 50+, lightweight, breathable.'
    },
    // ----- BUNDLES (own product type, not a discount code) -----
    {
      id: 'complete-set', name: 'The Complete Set', price: 178,
      category: 'bundles', categoryLabel: 'BUNDLES', collection: 'Curated Bundles',
      img: IMG.twogirls, gallery: gallery([IMG.twogirls, IMG.top1, IMG.confident, IMG.blue]),
      colors: [BK, SL, CL], sizes: FULL_SIZES, soldOut: '',
      rating: 5.0, reviewCount: 63, isNew: true, fabricTech: 'KalFlex',
      bundle: true, includes: ['biftu-mid-tunic', 'wide-leg-pant', 'mako-sport-hijab'],
      completeLook: [],
      blurb: 'The full Kalsoni look in one purchase — Biftu Mid-Length Tunic, Wide Leg Pant and a Mako Sport Hijab in coordinating colours. A complete modest outfit, ready to move.',
      fabric: 'Matched performance knit across all three pieces. Moisture-wicking, four-way stretch.'
    },
    {
      id: 'starter-kit', name: 'Starter Kit', price: 129,
      category: 'bundles', categoryLabel: 'BUNDLES', collection: 'Curated Bundles',
      img: IMG.top2, gallery: gallery([IMG.top2, IMG.hijab1, IMG.blue]),
      colors: [BK, SD], sizes: FULL_SIZES, soldOut: '',
      rating: 4.9, reviewCount: 41, isNew: true, fabricTech: 'KalFlex',
      bundle: true, includes: ['biftu-full-tunic', 'safiya-sport-hijab'],
      completeLook: [],
      blurb: 'New to Kalsoni? Start here. The Biftu Full-Length Tunic paired with a Safiya Sport Hijab — everything you need for your first modest activewear look.',
      fabric: 'Matched performance knit. Moisture-wicking, four-way stretch, UPF 50+ hijab.'
    },
    {
      id: 'mix-match-3', name: 'Mix & Match 3', price: 99,
      category: 'bundles', categoryLabel: 'BUNDLES', collection: 'Curated Bundles',
      img: IMG.top1, gallery: gallery([IMG.top1, IMG.confident, IMG.shawl]),
      colors: [BK, SL, OL], sizes: FULL_SIZES, soldOut: '',
      rating: 4.9, reviewCount: 57, isNew: true, fabricTech: 'KalFlex',
      bundle: true, includes: ['biftu-mid-tunic', 'joggers', 'mako-sport-shawl'],
      completeLook: [],
      blurb: 'Build your own set — choose any three core pieces and save. Mix tunics, bottoms, hijabs and shawls to make the look that moves with you.',
      fabric: 'Mixed performance fabrics depending on the pieces selected.'
    }
  ];

  var reviews = [
    { name: 'Hodan A.', date: 'MAY 2026', title: 'Stays put, finally', body: 'I have tried every "sport hijab" out there. This is the only one that does not shift mid-run. Breathable and so light I forget I am wearing it.' },
    { name: 'Maryam K.', date: 'APR 2026', title: 'Coverage and comfort', body: 'The coverage is exactly what I needed and the fabric is genuinely high performance. Wore it for a HIIT class and stayed cool the whole time.' },
    { name: 'Iqra D.', date: 'MAR 2026', title: 'Worth every penny', body: 'Beautifully made, true to size, and the colour is gorgeous. You can tell it was designed by someone who actually trains in modest wear.' }
  ];

  var sizeRows = [
    { size: 'XS', bust: '31–32', waist: '24–25', hip: '34–35' },
    { size: 'S', bust: '33–34', waist: '26–27', hip: '36–37' },
    { size: 'M', bust: '35–36', waist: '28–29', hip: '38–39' },
    { size: 'L', bust: '37–39', waist: '30–32', hip: '40–42' },
    { size: 'XL', bust: '40–42', waist: '33–35', hip: '43–45' },
    { size: 'XXL', bust: '43–45', waist: '36–38', hip: '46–48' },
    { size: '3XL', bust: '46–48', waist: '39–41', hip: '49–51' },
    { size: '4XL', bust: '49–51', waist: '42–44', hip: '52–54' },
    { size: '5XL', bust: '52–54', waist: '45–47', hip: '55–57' }
  ];

  // Named collections (Lyra-style) — drives the Collections page.
  var collections = [
    { label: 'The Biftu Collection', cat: 'tops', blurb: 'Our signature mid- and full-length tunics — modest coverage that performs, in five core colours.' },
    { label: 'Performance Bottoms', cat: 'bottoms', blurb: 'Wide leg pants and joggers, full opacity and built to move with you.' },
    { label: 'The Performance Hijab Collection', cat: 'hijabs-shawls', blurb: 'Sport hijabs and shawls engineered to stay put through every workout. The line that sets us apart.' },
    { label: 'Curated Bundles', cat: 'bundles', blurb: 'Complete looks, styled and priced as a set — the easiest way to shop Kalsoni.' }
  ];

  // Homepage category tiles (the four requested categories).
  var categoryTiles = [
    { label: 'Tops', cat: 'tops', img: IMG.top1 },
    { label: 'Bottoms', cat: 'bottoms', img: IMG.confident },
    { label: 'Sport Hijabs & Shawls', cat: 'hijabs-shawls', img: IMG.blue },
    { label: 'Bundles', cat: 'bundles', img: IMG.twogirls }
  ];

  // Shoppable Instagram / UGC (each post links to the product worn).
  var ugcPosts = [
    { img: IMG.blue, productId: 'mako-sport-hijab', handle: '@aminamoves' },
    { img: IMG.top2, productId: 'biftu-mid-tunic', handle: '@layla.runs' },
    { img: IMG.confident, productId: 'wide-leg-pant', handle: '@sumaya.fit' },
    { img: IMG.hijab1, productId: 'safiya-sport-hijab', handle: '@hodanactive' }
  ];

  // Editorial lookbook — the "drop" feeling, separate from Shop.
  var lookbook = {
    season: 'FW26 — THE DROP',
    title: 'Between Tides',
    intro: 'A study in movement and stillness. Our newest collection is built around layered coverage that breathes — designed for the in-between moments, from sunrise training to slow evenings.',
    hero: IMG.hero,
    blocks: [
      { kicker: 'CHAPTER 01', title: 'First Light', body: 'The Biftu Tunic in Sand, layered over the Wide Leg Pant. Built for the quiet, deliberate start of a day in motion.', img: IMG.top1, productId: 'biftu-mid-tunic' },
      { kicker: 'CHAPTER 02', title: 'In Motion', body: 'The Mako Sport Hijab stays put through every sprint and stretch — our most-worn piece, reimagined in three new tones.', img: IMG.blue, productId: 'mako-sport-hijab' },
      { kicker: 'CHAPTER 03', title: 'After Hours', body: 'The full-length tunic and joggers, styled to move from the studio to the street without missing a beat.', img: IMG.confident, productId: 'biftu-full-tunic' }
    ]
  };

  function money(n) { return '$' + Number(n).toFixed(2); }
  function getProduct(id) {
    for (var i = 0; i < products.length; i++) if (products[i].id === id) return products[i];
    return products[0];
  }
  function getMany(ids) {
    return (ids || []).map(getProduct).filter(Boolean);
  }

  window.KALSONI = {
    IMG: IMG,
    products: products,
    reviews: reviews,
    sizeRows: sizeRows,
    collections: collections,
    categoryTiles: categoryTiles,
    ugcPosts: ugcPosts,
    lookbook: lookbook,
    money: money,
    getProduct: getProduct,
    getMany: getMany
  };
})();
