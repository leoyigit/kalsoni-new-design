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

  // Per-COLOUR galleries (front, side, back, detail, flat-lay). Real photography is
  // TBD — each colour gets its own 5-shot set from the image pool (rotated so colours
  // look distinct) so real per-colour assets drop straight into these slots later.
  function colorGalleries(pool, count) {
    var labels = ['Front', 'Side', 'Back', 'Detail', 'Flat-lay'];
    var out = [];
    for (var ci = 0; ci < count; ci++) {
      out.push(labels.map(function (label, i) {
        return { label: label, img: pool[(i + ci) % pool.length] };
      }));
    }
    return out;
  }

  var products = [
    // ----- TOPS — The Biftu Collection -----
    {
      id: 'biftu-mid-tunic', name: 'Biftu Mid-Length Tunic', price: 78,
      category: 'tops', categoryLabel: 'TOPS', collection: 'The Biftu Collection',
      img: IMG.top1, pool: [IMG.top1, IMG.top2, IMG.confident, IMG.jacket],
      colors: [BK, SD, SL, CL, OL], sizes: FULL_SIZES, soldOut: '5XL',
      rating: 4.9, reviewCount: 142, isNew: true, fabricTech: 'KalFlex',
      completeLook: ['wide-leg-pant', 'mako-sport-hijab'],
      blurb: 'Our signature mid-length tunic — a relaxed, fully-covering silhouette with side slits for easy movement. The cornerstone of the Biftu Collection, available in five core colours.',
      fabric: 'KalFlex — 88% recycled polyester, 12% elastane. Soft-touch, four-way stretch, breathable knit.',
      reviews: [
        { name: 'Hodan A.', date: 'MAY 2026', title: 'Covers everything, still moves', body: 'The mid-length is perfect — full coverage but I can still do a deep squat without it riding up. The fabric is buttery soft.' },
        { name: 'Nasra Y.', date: 'APR 2026', title: 'The Sand colour is stunning', body: 'Even nicer in person. True to size and the side slits make such a difference for movement.' },
        { name: 'Amal R.', date: 'MAR 2026', title: 'My everyday tunic', body: 'I bought one and immediately ordered two more colours. It works for the gym and for the school run.' }
      ]
    },
    {
      id: 'biftu-full-tunic', name: 'Biftu Full-Length Tunic', price: 88,
      category: 'tops', categoryLabel: 'TOPS', collection: 'The Biftu Collection',
      img: IMG.top2, pool: [IMG.top2, IMG.top1, IMG.twogirls, IMG.jacket],
      colors: [BK, SD, SL, IV], sizes: FULL_SIZES, soldOut: '',
      rating: 4.8, reviewCount: 96, isNew: true, fabricTech: 'KalFlex',
      completeLook: ['joggers', 'safiya-sport-hijab'],
      blurb: 'Maximum coverage, zero compromise on movement. The full-length tunic drapes to mid-thigh with a high neck and thumbhole cuffs — modest, elegant and built to perform.',
      fabric: 'KalFlex — 88% recycled polyester, 12% elastane. Elegant drape, four-way stretch.',
      reviews: [
        { name: 'Maryam K.', date: 'MAY 2026', title: 'Finally, full coverage that moves', body: 'It still moves with me and never feels like a tent. The thumbholes are a small detail I did not know I needed.' },
        { name: 'Sumaya A.', date: 'FEB 2026', title: 'Flattering and breathable', body: 'Wore it through a long training session and stayed cool. The Ivory is gorgeous and not see-through at all.' }
      ]
    },
    // ----- BOTTOMS -----
    {
      id: 'wide-leg-pant', name: 'Wide Leg Pant', price: 68,
      category: 'bottoms', categoryLabel: 'BOTTOMS', collection: 'Performance Bottoms',
      img: IMG.confident, pool: [IMG.confident, IMG.twogirls, IMG.top1],
      colors: [BK, SL], sizes: FULL_SIZES, soldOut: '',
      rating: 4.9, reviewCount: 188, isNew: false, fabricTech: 'KalFlex',
      completeLook: ['biftu-mid-tunic', 'mako-sport-shawl'],
      blurb: 'A flowing wide-leg trouser with a high, supportive waistband and full opacity. Studio-to-street coverage that moves like activewear and reads like everyday wear.',
      fabric: 'KalFlex — 76% recycled nylon, 24% elastane. Squat-proof, opaque, four-way stretch.',
      reviews: [
        { name: 'Iqra D.', date: 'APR 2026', title: 'So flattering and they stay put', body: 'The waistband actually stays in place. Wore them to teach and then straight to the gym.' },
        { name: 'Leyla H.', date: 'JAN 2026', title: 'New everyday bottoms', body: 'Opaque, comfortable, and they do not cling. I basically live in these now.' }
      ]
    },
    {
      id: 'joggers', name: 'Joggers', price: 64,
      category: 'bottoms', categoryLabel: 'BOTTOMS', collection: 'Performance Bottoms',
      img: IMG.jacket, pool: [IMG.jacket, IMG.confident, IMG.twogirls],
      colors: [BK, OL], sizes: FULL_SIZES, soldOut: 'XS',
      rating: 4.8, reviewCount: 121, isNew: false, fabricTech: 'BreezeLuxe',
      completeLook: ['biftu-full-tunic', 'mako-sport-hijab'],
      blurb: 'Tapered, cuffed joggers with a relaxed modest fit and deep side pockets. Lightweight enough to train in, soft enough to live in.',
      fabric: 'BreezeLuxe — 80% recycled nylon, 20% elastane. Lightweight, breathable, quick-dry.',
      reviews: [
        { name: 'Fadumo S.', date: 'MAR 2026', title: 'Real pockets, finally', body: 'Lightweight joggers with deep pockets — perfect for travel days. Sizing was spot on.' },
        { name: 'Zainab M.', date: 'FEB 2026', title: 'Relaxed without looking sloppy', body: 'Soft and comfy but still put-together. The Olive is a beautiful colour.' }
      ]
    },
    // ----- SPORT HIJABS & SHAWLS — The Performance Hijab Collection -----
    {
      id: 'safiya-sport-hijab', name: 'Safiya Sport Hijab', price: 38,
      category: 'hijabs-shawls', categoryLabel: 'SPORT HIJABS & SHAWLS', collection: 'The Performance Hijab Collection',
      img: IMG.blue, pool: [IMG.blue, IMG.hijab1, IMG.confident],
      colors: [BK], sizes: ['S/M', 'L/XL'], soldOut: '',
      rating: 4.9, reviewCount: 214, isNew: true, fabricTech: 'BreezeLuxe',
      completeLook: ['biftu-full-tunic', 'wide-leg-pant'],
      blurb: 'The Safiya — our fitted, instant-on sport hijab. Engineered to stay put through every rep, sprint and stretch, with full coverage at the neckline. Available in two sizes for the perfect fit.',
      fabric: 'BreezeLuxe — 90% recycled polyester, 10% elastane. Moisture-wicking, four-way stretch, UPF 50+.',
      reviews: [
        { name: 'Hodan A.', date: 'MAY 2026', title: 'Does not budge', body: 'I ran 10k and never had to readjust it once. Breathable and so light I forget it is there.' },
        { name: 'Khadija O.', date: 'APR 2026', title: 'Two sizes is a game changer', body: 'I finally got a proper fit instead of one-size-fits-none. Full coverage at the neck too.' }
      ]
    },
    {
      id: 'mako-sport-hijab', name: 'Mako Sport Hijab', price: 34,
      category: 'hijabs-shawls', categoryLabel: 'SPORT HIJABS & SHAWLS', collection: 'The Performance Hijab Collection',
      img: IMG.hijab1, pool: [IMG.hijab1, IMG.blue, IMG.top2],
      colors: [BK, SD, ST], sizes: ['One Size'], soldOut: '',
      rating: 4.8, reviewCount: 167, isNew: true, fabricTech: 'BreezeLuxe',
      completeLook: ['biftu-mid-tunic', 'joggers'],
      blurb: 'The Mako — a lightweight, one-size sport hijab with an easy pull-on fit. Breathable, quick-drying and secure for high-intensity activity or all-day wear.',
      fabric: 'BreezeLuxe — 90% recycled polyester, 10% elastane. Quick-dry, anti-odour, breathable.',
      reviews: [
        { name: 'Sagal A.', date: 'MAY 2026', title: 'One-size that actually fits', body: 'Light enough that I forget I am wearing it during HIIT, and it stays put the whole class.' },
        { name: 'Ayan I.', date: 'MAR 2026', title: 'Want every colour', body: 'Three tones and I already have two. Breathable and the fit is so easy.' }
      ]
    },
    {
      id: 'safiya-sport-shawl', name: 'Safiya Sport Shawl', price: 42,
      category: 'hijabs-shawls', categoryLabel: 'SPORT HIJABS & SHAWLS', collection: 'The Performance Hijab Collection',
      img: IMG.shawl, pool: [IMG.shawl, IMG.blue, IMG.confident],
      colors: [BK, SL, CL], sizes: ['One Size'], soldOut: '',
      rating: 4.8, reviewCount: 88, isNew: false, fabricTech: 'SolShield',
      completeLook: ['biftu-full-tunic', 'wide-leg-pant'],
      blurb: 'A versatile performance shawl offering full coverage with an effortless drape. Quick-drying, lightweight and easy to restyle from workout to everyday.',
      fabric: 'SolShield — 90% recycled polyester, 10% elastane. UPF 50+, quick-dry, anti-odour.',
      reviews: [
        { name: 'Munira H.', date: 'APR 2026', title: 'Beautiful drape', body: 'So easy to restyle and it goes straight from a workout to errands. Full coverage without the bulk.' },
        { name: 'Rahma D.', date: 'JAN 2026', title: 'Exactly what I wanted', body: 'Quick-drying and lightweight. The Clay colour is even better in person.' }
      ]
    },
    {
      id: 'mako-sport-shawl', name: 'Mako Sport Shawl', price: 40,
      category: 'hijabs-shawls', categoryLabel: 'SPORT HIJABS & SHAWLS', collection: 'The Performance Hijab Collection',
      img: IMG.shawl, pool: [IMG.shawl, IMG.hijab1, IMG.top2],
      colors: [BK, SD, SL, CL], sizes: ['One Size'], soldOut: '',
      rating: 4.7, reviewCount: 74, isNew: false, fabricTech: 'SolShield',
      completeLook: ['biftu-mid-tunic', 'joggers'],
      blurb: 'The Mako shawl in four core colours — a draped, full-coverage layer that finishes any look. Soft, breathable and built for movement.',
      fabric: 'SolShield — 90% recycled polyester, 10% elastane. UPF 50+, lightweight, breathable.',
      reviews: [
        { name: 'Asha M.', date: 'MAR 2026', title: 'My go-to layer', body: 'Soft, breathable and the colours are gorgeous. It does not slip around like other shawls.' },
        { name: 'Bilan K.', date: 'FEB 2026', title: 'Worth it', body: 'Lightweight and full coverage. I reach for this one more than any other.' }
      ]
    },
    // ----- BUNDLES (own product type, not a discount code) -----
    {
      id: 'complete-set', name: 'The Complete Set', price: 178,
      category: 'bundles', categoryLabel: 'BUNDLES', collection: 'Curated Bundles',
      img: IMG.twogirls, pool: [IMG.twogirls, IMG.top1, IMG.confident, IMG.blue],
      colors: [BK, SL, CL], sizes: FULL_SIZES, soldOut: '',
      rating: 5.0, reviewCount: 63, isNew: true, fabricTech: 'KalFlex',
      bundle: true, includes: ['biftu-mid-tunic', 'wide-leg-pant', 'mako-sport-hijab'],
      completeLook: [],
      blurb: 'The full Kalsoni look in one purchase — Biftu Mid-Length Tunic, Wide Leg Pant and a Mako Sport Hijab in coordinating colours. A complete modest outfit, ready to move.',
      fabric: 'Matched performance knit across all three pieces. Moisture-wicking, four-way stretch.',
      reviews: [
        { name: 'Yasmin A.', date: 'MAY 2026', title: 'Everything matched out of the box', body: 'Bought the Complete Set as my first Kalsoni order — every piece coordinated and arrived ready to wear.' },
        { name: 'Halima N.', date: 'MAR 2026', title: 'Such good value', body: 'Buying the set saved me money and the pieces look made for each other.' }
      ]
    },
    {
      id: 'starter-kit', name: 'Starter Kit', price: 129,
      category: 'bundles', categoryLabel: 'BUNDLES', collection: 'Curated Bundles',
      img: IMG.top2, pool: [IMG.top2, IMG.hijab1, IMG.blue],
      colors: [BK, SD], sizes: FULL_SIZES, soldOut: '',
      rating: 4.9, reviewCount: 41, isNew: true, fabricTech: 'KalFlex',
      bundle: true, includes: ['biftu-full-tunic', 'safiya-sport-hijab'],
      completeLook: [],
      blurb: 'New to Kalsoni? Start here. The Biftu Full-Length Tunic paired with a Safiya Sport Hijab — everything you need for your first modest activewear look.',
      fabric: 'Matched performance knit. Moisture-wicking, four-way stretch, UPF 50+ hijab.',
      reviews: [
        { name: 'Sahra L.', date: 'APR 2026', title: 'Perfect intro to the brand', body: 'The tunic and hijab combo was all I needed to get started. Great quality for the price.' },
        { name: 'Deqa F.', date: 'FEB 2026', title: 'Lovely gift', body: 'Bought it for my sister and she wears it constantly. Easy, thoughtful gift.' }
      ]
    },
    {
      id: 'mix-match-3', name: 'Mix & Match 3', price: 99,
      category: 'bundles', categoryLabel: 'BUNDLES', collection: 'Curated Bundles',
      img: IMG.top1, pool: [IMG.top1, IMG.confident, IMG.shawl],
      colors: [BK, SL, OL], sizes: FULL_SIZES, soldOut: '',
      rating: 4.9, reviewCount: 57, isNew: true, fabricTech: 'KalFlex',
      bundle: true, includes: ['biftu-mid-tunic', 'joggers', 'mako-sport-shawl'],
      completeLook: [],
      blurb: 'Build your own set — choose any three core pieces and save. Mix tunics, bottoms, hijabs and shawls to make the look that moves with you.',
      fabric: 'Mixed performance fabrics depending on the pieces selected.',
      reviews: [
        { name: 'Ifrah B.', date: 'MAY 2026', title: 'Loved picking my three', body: 'Mixed a tunic, joggers and a shawl. Build-your-own bundle is genius and saved money.' },
        { name: 'Warda H.', date: 'JAN 2026', title: 'Exactly what I wanted', body: 'Got the three pieces I actually needed at a better price. More of this please.' }
      ]
    }
  ];

  // Per-colour galleries + a default gallery (first colour) for cards.
  products.forEach(function (p) {
    p.colorGalleries = colorGalleries(p.pool, p.colors.length);
    p.gallery = p.colorGalleries[0];
  });

  // Fallback reviews (used only if a product has none).
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

  // The Journal — product blog of new & upcoming releases (KITH-style).
  // Each entry links to a full editorial article (journal-post.html?post=slug).
  var journal = [
    { slug: 'between-tides-drop', date: 'JUNE 2026', kicker: 'COMING SOON', title: 'A Closer Look at Between Tides', img: IMG.hero, excerpt: 'A first look at our FW26 collection — layered coverage built to breathe. Sign up to shop it first.' },
    { slug: 'upf-performance-shirt', date: 'JUNE 2026', kicker: 'IN THE WORKS', title: 'Sun-proof: the UPF 50+ Performance Shirt', img: IMG.jacket, excerpt: 'The next piece in the line — a long-sleeve performance shirt with built-in UPF 50+ sun protection.' },
    { slug: 'mako-three-tones', date: 'MAY 2026', kicker: 'NEW COLOURS', title: 'The Mako Hijab, now in three tones', img: IMG.blue, excerpt: 'Our most-worn sport hijab expands — Sand and Steel join the lineup alongside Black.' },
    { slug: 'behind-the-seams-biftu', date: 'APRIL 2026', kicker: 'BEHIND THE SEAMS', title: 'How we built the Biftu Tunic', img: IMG.top1, excerpt: 'The fabric, the fit and the years of testing behind our signature piece.' },
    { slug: 'five-ways-wide-leg', date: 'MARCH 2026', kicker: 'STYLING', title: 'Five ways to wear the Wide Leg Pant', img: IMG.confident, excerpt: 'From sunrise training to slow evenings — our favourite ways to style the wide leg.' },
    { slug: 'bundles-reimagined', date: 'FEBRUARY 2026', kicker: 'COMING SOON', title: 'Bundles, reimagined', img: IMG.twogirls, excerpt: 'New curated sets land soon — the easiest way to shop a complete modest look.' }
  ];

  // Full article content for each journal entry.
  // Block types: h2 | p (html allowed) | img {src, caption} | quote {text, cite}
  //              shop {title, note, ids} | signup {title, body, cta}
  var journalPosts = [
    {
      slug: 'between-tides-drop',
      date: 'JUNE 2026',
      kicker: 'COMING SOON',
      title: 'A Closer Look at Between Tides',
      hero: IMG.hero,
      standfirst: 'Our FW26 collection is a study in movement and stillness — layered coverage that breathes, designed for the in-between moments from sunrise training to slow evenings. Here is an early look at the pieces, the palette and the thinking behind the drop.',
      blocks: [
        { type: 'p', html: 'Every Kalsoni collection starts with the same question: where does modest activewear still make you choose between coverage and comfort? For Between Tides, the answer was layering. Most of us do not train in a single piece — we layer a tunic over a pant, a shawl over a tunic, and every added layer is added heat.' },
        { type: 'p', html: 'So this collection was engineered from the skin out. The Biftu Full-Length Tunic returns as the anchor piece, cut in our KalFlex knit with a re-graded drape that sits away from the body, so air actually moves under the layer instead of being trapped by it.' },
        { type: 'img', src: IMG.top2, caption: 'The Biftu Full-Length Tunic — the anchor of the Between Tides drop.' },
        { type: 'h2', text: 'The palette' },
        { type: 'p', html: 'Between Tides borrows its colours from the hour when the light changes — Sand, Slate and Ivory, with Clay as the single warm accent. Every piece in the drop coordinates with every other piece, so any tunic, pant and hijab you pull from the collection works as one look.' },
        { type: 'quote', text: 'We wanted a collection you could get dressed in with your eyes closed — every combination already works.', cite: 'Kalsoni Design Team' },
        { type: 'h2', text: 'What to expect' },
        { type: 'p', html: 'The drop pairs the full-length tunic with the Wide Leg Pant and the Safiya Sport Hijab — full coverage at the neckline, two sizes for a proper fit, and a knit that stays put from the first rep to the last. The pieces below are live now; the new colourways land with the drop.' },
        { type: 'shop', title: 'Shop the story', note: 'The Between Tides silhouettes, available now in core colours.', ids: ['biftu-full-tunic', 'wide-leg-pant', 'safiya-sport-hijab'] },
        { type: 'signup', title: 'Shop it first', body: 'Between Tides lands this fall. Join the list and get 24-hour early access before the collection goes live.', cta: 'GET EARLY ACCESS' }
      ]
    },
    {
      slug: 'upf-performance-shirt',
      date: 'JUNE 2026',
      kicker: 'IN THE WORKS',
      title: 'Sun-proof: the UPF 50+ Performance Shirt',
      hero: IMG.jacket,
      standfirst: 'The next piece in the Kalsoni line is a long-sleeve performance shirt with UPF 50+ sun protection built into the fabric itself — full coverage that works as hard outdoors as it does in the studio.',
      blocks: [
        { type: 'p', html: 'Modest activewear already covers you — but coverage is not the same as protection. Standard knits let a surprising amount of UV through, especially when stretched. Our community trains outside: long runs, hikes, sculling on the lakes, full days at outdoor tournaments. They asked for a layer that takes sun exposure off the list of things to think about.' },
        { type: 'p', html: 'The answer is a long-sleeve performance shirt cut from our SolShield fabric — the same UPF 50+ knit we use in the Safiya and Mako shawls, re-engineered at a heavier gauge for a standalone top. UPF 50+ means the fabric blocks about 98% of UVA and UVB rays, rated in the fabric, not sprayed on, so it never washes out.' },
        { type: 'h2', text: 'Designed for long hours outside' },
        { type: 'p', html: 'The fit follows the Biftu philosophy: relaxed through the body, longer at the hem, with thumbhole cuffs so the sleeve stays anchored over the back of the hand — the spot everyone forgets to cover. Quick-dry and anti-odour finishes carry over from the rest of the SolShield line.' },
        { type: 'quote', text: 'It blocks about 98% of UV — rated in the fabric itself, so it never washes out.', cite: 'Fabric development notes' },
        { type: 'p', html: 'While the shirt is in final wear-testing, the SolShield fabric is already out in the world — both of our performance shawls are cut from it, and they are the best way to feel the hand of the fabric before the shirt lands.' },
        { type: 'shop', title: 'Meet the fabric', note: 'SolShield UPF 50+ — already available in our performance shawls.', ids: ['safiya-sport-shawl', 'mako-sport-shawl'] },
        { type: 'signup', title: 'Be first to know', body: 'The UPF 50+ Performance Shirt is in final testing. Leave your email and we will tell you the moment it drops.', cta: 'NOTIFY ME' }
      ]
    },
    {
      slug: 'mako-three-tones',
      date: 'MAY 2026',
      kicker: 'NEW COLOURS',
      title: 'The Mako Hijab, now in three tones',
      hero: IMG.blue,
      standfirst: 'Our most-worn sport hijab grows up — Sand and Steel join Black, so the Mako finally matches every outfit it gets pulled over.',
      blocks: [
        { type: 'p', html: 'The Mako Sport Hijab has quietly become the piece our customers reorder most. One size, an easy pull-on fit, and a BreezeLuxe knit light enough to forget mid-workout — it earned its place as the everyday default. But it only came in Black, and you told us: the hijab is the one piece that has to work with everything.' },
        { type: 'img', src: IMG.hijab1, caption: 'The Mako’s pull-on construction — no pins, no wrap, no readjusting.' },
        { type: 'h2', text: 'Why Sand and Steel' },
        { type: 'p', html: 'We tested a dozen tones against the full catalog and kept coming back to two. Sand is the warm neutral that lifts the Biftu Tunic’s earth palette; Steel is the cool one that sharpens Slate and Black. Between the three, every colour combination in the line now has a matching Mako.' },
        { type: 'p', html: 'The fabric has not changed — 90% recycled polyester, 10% elastane, moisture-wicking, quick-dry, anti-odour. If your Black Mako fits, the new tones fit identically.' },
        { type: 'quote', text: 'Light enough that I forget I am wearing it during HIIT, and it stays put the whole class.', cite: 'Sagal A., verified buyer' },
        { type: 'shop', title: 'Shop the Mako line', note: 'The hijab in three tones, and the matching shawl in four.', ids: ['mako-sport-hijab', 'mako-sport-shawl'] },
        { type: 'p', html: 'Prefer a fitted, two-size construction? The Safiya Sport Hijab is the Mako’s secure high-intensity sibling — full coverage at the neckline and engineered to stay put through every sprint.' },
        { type: 'shop', title: 'Complete the rotation', ids: ['safiya-sport-hijab'] }
      ]
    },
    {
      slug: 'behind-the-seams-biftu',
      date: 'APRIL 2026',
      kicker: 'BEHIND THE SEAMS',
      title: 'How we built the Biftu Tunic',
      hero: IMG.top1,
      standfirst: 'Three years, four fabric mills and more than sixty prototypes — the story of the piece that started Kalsoni, and why the details matter more than they look.',
      blocks: [
        { type: 'p', html: 'The Biftu Tunic exists because nothing like it did. When we started training in modest wear, the options were a compromise in one direction or the other: activewear brands offered "longline" tops that ended at the hip, and modest fashion offered beautiful tunics in fabrics never meant to sweat in. The gap in the middle is where Kalsoni lives.' },
        { type: 'h2', text: 'The fabric came first' },
        { type: 'p', html: 'Before a single pattern was cut we spent a year on fabric. The brief sounded impossible: opaque at full stretch, soft enough for all-day wear, structured enough to drape instead of cling, and made responsibly. KalFlex — 88% recycled polyester, 12% elastane — was the fourth mill’s answer, and the moment we felt it we knew the tunic could exist.' },
        { type: 'img', src: IMG.top2, caption: 'KalFlex at full stretch — opaque, four-way, and soft on the skin.' },
        { type: 'h2', text: 'Then the fit' },
        { type: 'p', html: 'A modest cut that moves is a geometry problem. The side slits are set exactly where a deep squat needs them and nowhere else. The hem is weighted to fall back into place after a burpee. The neckline is high without touching the throat. Sixty-plus prototypes, tested by real women in real training — running, lifting, teaching, chasing kids — until the notes stopped coming back.' },
        { type: 'quote', text: 'The mid-length is perfect — full coverage but I can still do a deep squat without it riding up.', cite: 'Hodan A., verified buyer' },
        { type: 'h2', text: 'Two lengths, one idea' },
        { type: 'p', html: 'The tunic ships in two cuts: the Mid-Length, our do-everything original in five colours, and the Full-Length, which drapes to mid-thigh with thumbhole cuffs for maximum coverage. Same fabric, same testing, different lines on the body — because modesty is personal, and the choice should be yours.' },
        { type: 'shop', title: 'Shop the Biftu Collection', note: 'Both lengths, in every core colour.', ids: ['biftu-mid-tunic', 'biftu-full-tunic'] }
      ]
    },
    {
      slug: 'five-ways-wide-leg',
      date: 'MARCH 2026',
      kicker: 'STYLING',
      title: 'Five ways to wear the Wide Leg Pant',
      hero: IMG.confident,
      standfirst: 'Our most-reviewed piece is also our most versatile. From sunrise training to slow evenings, here are the five looks our community wears on repeat.',
      blocks: [
        { type: 'h2', text: '01 — The studio set' },
        { type: 'p', html: 'The classic. Wide Leg Pant in Black under the Biftu Mid-Length Tunic, Mako hijab to match. The high waistband holds through inversions and the wide hem never catches a heel. This is the combination our Complete Set bundle was built around.' },
        { type: 'h2', text: '02 — The long run' },
        { type: 'p', html: 'Swap in the Safiya Sport Hijab for its locked-in fit and let the pant do what it does best: full opacity in motion, zero cling, and a fabric that wicks before you notice you are working.' },
        { type: 'img', src: IMG.twogirls, caption: 'One pant, two looks — the wide leg reads studio or street depending on the layer.' },
        { type: 'h2', text: '03 — Studio to street' },
        { type: 'p', html: 'The trick of the wide leg is that it does not read as activewear. With the Full-Length Tunic in Ivory it becomes an outfit you can wear to lunch straight from class — no changing-room stop required.' },
        { type: 'h2', text: '04 — The travel uniform' },
        { type: 'p', html: 'Long-haul flights are where the four-way stretch earns its keep. Pair with the Mako Sport Shawl — it doubles as a blanket layer at altitude and restyles in seconds at arrivals.' },
        { type: 'h2', text: '05 — Slate on slate' },
        { type: 'p', html: 'The tonal look: Wide Leg Pant in Slate, Biftu Tunic in Slate, Steel Mako on top. Monochrome layering makes a two-piece outfit read as considered, and every piece already coordinates by design.' },
        { type: 'quote', text: 'The waistband actually stays in place. Wore them to teach and then straight to the gym.', cite: 'Iqra D., verified buyer' },
        { type: 'shop', title: 'Build the looks', note: 'Everything styled above, available now.', ids: ['wide-leg-pant', 'biftu-mid-tunic', 'mako-sport-hijab', 'mako-sport-shawl'] }
      ]
    },
    {
      slug: 'bundles-reimagined',
      date: 'FEBRUARY 2026',
      kicker: 'COMING SOON',
      title: 'Bundles, reimagined',
      hero: IMG.twogirls,
      standfirst: 'A complete modest look should not take an hour of cross-referencing colours. Our curated bundles put a full outfit in one click — and they are about to get better.',
      blocks: [
        { type: 'p', html: 'The most common message we get from first-time customers is not about fabric or fit — it is "what goes with what?" Modest activewear is layered by nature, and building a first outfit from scratch means matching a tunic, a bottom and a hijab across colours and fabrics. Bundles remove that work entirely.' },
        { type: 'h2', text: 'Three ways in' },
        { type: 'p', html: 'The Complete Set is the full Kalsoni look — tunic, wide leg pant and Mako hijab in coordinating colours. The Starter Kit pairs the Full-Length Tunic with a Safiya hijab for a lighter first order. And Mix &amp; Match 3 lets you pick any three core pieces and save — the option our returning customers use most.' },
        { type: 'shop', title: 'Shop the bundles', note: 'Every set is priced below its pieces bought separately.', ids: ['complete-set', 'starter-kit', 'mix-match-3'] },
        { type: 'h2', text: 'What’s next' },
        { type: 'p', html: 'Later this year, bundles get per-piece size selection at checkout, seasonal colour stories that rotate with each drop, and a build-your-own flow that suggests coordinating colours as you pick. The goal: make the bundle the easiest way to shop Kalsoni, whether it is your first order or your fifth.' },
        { type: 'quote', text: 'Bought the Complete Set as my first Kalsoni order — every piece coordinated and arrived ready to wear.', cite: 'Yasmin A., verified buyer' },
        { type: 'signup', title: 'Bundle news first', body: 'Be the first to hear when the new bundle builder and seasonal sets go live.', cta: 'KEEP ME POSTED' }
      ]
    }
  ];

  function money(n) { return '$' + Number(n).toFixed(2); }
  function getPost(slug) {
    for (var i = 0; i < journalPosts.length; i++) if (journalPosts[i].slug === slug) return journalPosts[i];
    return journalPosts[0];
  }
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
    journal: journal,
    journalPosts: journalPosts,
    money: money,
    getProduct: getProduct,
    getPost: getPost,
    getMany: getMany
  };
})();
