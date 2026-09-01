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
    confident: CDN + '1661928512610-HXXNX8A99W4LE10R6HD0/image.jpg?format=1000w',
    campaign:  'assets/hero-campaign.png'
  };

  // Homepage campaign hero — swap this object for future drops.
  // layout: 'split' = copy panel + photography. 'overlay' = full-bleed image, copy in a corner.
  // images[] = one or two photos in the media area (split layout shows them side by side).
  var campaignHero = {
    id: 'freedom-to-move',
    layout: 'split',
    align: 'top-left',
    kicker: 'PERFORMANCE APPAREL · MADE WITH MORE IN MIND',
    headline: 'The freedom to move as yourself.',
    sub: 'Thoughtfully designed for the coverage you want and the movement you love.',
    images: [
      { src: 'assets/hero-move.png', alt: 'Athlete in a Kalsoni tunic and sport hijab, lunging in studio', position: 'center 18%' },
      { src: 'assets/hero-city.png', alt: 'Woman in a Kalsoni tunic and sport hijab on a city street', position: 'center 22%' }
    ],
    ctas: [
      { label: 'Shop best sellers', href: 'shop.html' },
      { label: 'Shop bundles', href: 'bundles.html' }
    ]
  };

  // Colour swatches — sellable colours only
  var BK  = { name: 'Black',     hex: '#1b1b1b' },
      PL  = { name: 'Plum',      hex: '#6b3d52' },
      BR  = { name: 'Brown',     hex: '#5c4033' },
      NVB = { name: 'Navy Blue', hex: '#1a2744' },
      NV  = { name: 'Navy',      hex: '#1a2744' },
      GY  = { name: 'Grey',      hex: '#7a7a7a' },
      RS  = { name: 'Rose',      hex: '#c9a0a8' },
      BL  = { name: 'Blue',      hex: '#4a7ab0' };

  var FULL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL'];
  var CAT = 'assets/catalog/';
  var BUN = 'assets/bundles/';

  function shot(file, label) {
    var img = file.indexOf('assets/') === 0 ? file : CAT + file;
    return { label: label || 'Front', img: img };
  }
  function gal() {
    return Array.prototype.slice.call(arguments).map(function (item) {
      return Array.isArray(item) ? shot(item[0], item[1]) : shot(item);
    });
  }

  // Fallback rotator when a product has no per-colour galleries.
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
    // ----- TOPS -----
    {
      id: 'adna-mid-tunic', name: 'Adna Mid-Length Tunic', price: 50,
      badge: 'BEST SELLER',
      category: 'tops', categoryLabel: 'TOPS', collection: 'The Biftu Collection',
      colors: [BK, PL, BR], sizes: FULL_SIZES, soldOut: '',
      rating: 4.9, reviewCount: 142, isNew: false, fabricTech: 'KalFlex',
      completeLook: ['wide-leg-pant', 'mako-sport-hijab'],
      colorGalleries: [
        gal(['adna-black-front.jpg', 'Front'], ['adna-black-side.jpg', 'Side'], ['adna-black-back.jpg', 'Back'], ['adna-black-ghost.png', 'Ghost']),
        gal(['adna-plum-front.jpg', 'Front'], ['adna-plum-side.jpg', 'Side'], ['adna-plum-back.jpg', 'Back'], ['adna-plum-ghost.png', 'Ghost']),
        gal(['adna-brown-front.jpg', 'Front'], ['adna-brown-side.jpg', 'Side'], ['adna-brown-back.jpg', 'Back'], ['adna-brown-ghost.png', 'Ghost'])
      ],
      blurb: 'Our signature mid-length tunic — a relaxed, fully-covering silhouette with side slits for easy movement. Available in Black, Plum and Brown.',
      fabric: 'KalFlex — 88% recycled polyester, 12% elastane. Soft-touch, four-way stretch, breathable knit.',
      reviews: [
        { name: 'Hodan A.', date: 'MAY 2026', title: 'Covers everything, still moves', body: 'The mid-length is perfect — full coverage but I can still do a deep squat without it riding up. The fabric is buttery soft.' },
        { name: 'Nasra Y.', date: 'APR 2026', title: 'The Plum colour is stunning', body: 'Even nicer in person. True to size and the side slits make such a difference for movement.' },
        { name: 'Amal R.', date: 'MAR 2026', title: 'My everyday tunic', body: 'I bought one and immediately ordered two more colours. It works for the gym and for the school run.' }
      ]
    },
    {
      id: 'biftu-full-tunic', name: 'Biftu Full-Length Tunic', price: 60,
      category: 'tops', categoryLabel: 'TOPS', collection: 'The Biftu Collection',
      colors: [BK, PL, BR, NVB], sizes: FULL_SIZES, soldOut: '',
      rating: 4.8, reviewCount: 96, isNew: false, fabricTech: 'KalFlex',
      completeLook: ['cargo-jogger', 'safiya-sport-hijab'],
      colorGalleries: [
        gal(['biftu-black-front.png', 'Front'], ['biftu-black-side.jpg', 'Side'], ['biftu-black-back.jpg', 'Back']),
        gal(['biftu-plum-front.png', 'Front'], ['biftu-plum-side.jpg', 'Side'], ['biftu-plum-back.jpg', 'Back']),
        gal(['biftu-brown-front.png', 'Front'], ['biftu-brown-side.jpg', 'Side'], ['biftu-brown-back.jpg', 'Back']),
        gal(['biftu-navy-front.png', 'Front'], ['biftu-navy-side.jpg', 'Side'], ['biftu-navy-back.jpg', 'Back'])
      ],
      blurb: 'Maximum coverage, zero compromise on movement. The full-length tunic drapes to mid-thigh with a high neck — modest, elegant and built to perform. In Black, Plum, Brown and Navy Blue.',
      fabric: 'KalFlex — 88% recycled polyester, 12% elastane. Elegant drape, four-way stretch.',
      reviews: [
        { name: 'Maryam K.', date: 'MAY 2026', title: 'Finally, full coverage that moves', body: 'It still moves with me and never feels like a tent. Full coverage without the bulk.' },
        { name: 'Sumaya A.', date: 'FEB 2026', title: 'Flattering and breathable', body: 'Wore it through a long training session and stayed cool. The Navy Blue is gorgeous and not see-through at all.' }
      ]
    },
    {
      id: 'upf-long-sleeve', name: 'UPF 50+ Long-Sleeve Performance Shirt', price: 40,
      category: 'tops', categoryLabel: 'TOPS', collection: 'Performance Tops',
      colors: [BK, NV, GY], sizes: FULL_SIZES, soldOut: '',
      rating: 4.7, reviewCount: 54, isNew: true, fabricTech: 'SolShield',
      completeLook: ['wide-leg-pant', 'mako-sport-hijab'],
      colorGalleries: [
        gal(['upf-black-front.png', 'Front'], ['upf-black-side.png', 'Side'], ['upf-black-back.png', 'Back']),
        gal(['upf-navy-front.png', 'Front'], ['upf-navy-side.png', 'Side'], ['upf-navy-back.png', 'Back']),
        gal(['upf-grey-front.png', 'Front'], ['upf-grey-side.png', 'Side'], ['upf-grey-back.png', 'Back'])
      ],
      blurb: 'A long-sleeve performance shirt with UPF 50+ sun protection built into the fabric. Relaxed through the body, longer at the hem — full coverage for training outdoors. In Black, Navy and Grey.',
      fabric: 'SolShield — 90% recycled polyester, 10% elastane. UPF 50+, quick-dry, anti-odour.',
      reviews: [
        { name: 'Amina H.', date: 'JUN 2026', title: 'My outdoor layer', body: 'Took it on a long hike and stayed covered without overheating. The Navy is a beautiful colour.' },
        { name: 'Leyla H.', date: 'MAY 2026', title: 'True UPF, not a coating', body: 'Lightweight enough to train in and I trust the sun protection. Grey goes with everything.' }
      ]
    },
    {
      id: 'zubeda-girls-tunic', name: 'Zubeda Girls Tunic', price: 40,
      category: 'tops', categoryLabel: 'TOPS', collection: 'Girls',
      colors: [BK, RS], sizes: ['S', 'M', 'L', 'XL'], soldOut: '',
      rating: 4.8, reviewCount: 31, isNew: true, fabricTech: 'KalFlex',
      completeLook: ['mako-sport-hijab'],
      colorGalleries: [
        gal(['zubeda-black.svg', 'Front']),
        gal(['zubeda-rose.svg', 'Front'])
      ],
      blurb: 'A girls’ performance tunic cut for movement and modest coverage. Same KalFlex knit as the adult line, in Black and Rose. Product photography TBD.',
      fabric: 'KalFlex — 88% recycled polyester, 12% elastane. Soft-touch, four-way stretch.',
      reviews: [
        { name: 'Fatima S.', date: 'MAY 2026', title: 'Finally something that fits her', body: 'My daughter can actually run in this. Coverage is right and the Rose is beautiful.' }
      ]
    },
    // ----- BOTTOMS -----
    {
      id: 'wide-leg-pant', name: 'High-Waist Wide-Leg Pants', price: 50,
      category: 'bottoms', categoryLabel: 'BOTTOMS', collection: 'Performance Bottoms',
      colors: [BK, BR], sizes: FULL_SIZES, soldOut: '',
      rating: 4.9, reviewCount: 188, isNew: false, fabricTech: 'KalFlex',
      completeLook: ['adna-mid-tunic', 'mako-sport-shawl'],
      colorGalleries: [
        gal(['wideleg-black-front.jpg', 'Front'], ['wideleg-black-back.jpg', 'Back'], ['wideleg-black-ghost.png', 'Ghost']),
        gal(['wideleg-brown-front.jpg', 'Front'], ['wideleg-brown-side.jpg', 'Side'], ['wideleg-brown-back.jpg', 'Back'], ['wideleg-brown-ghost.png', 'Ghost'])
      ],
      blurb: 'A flowing wide-leg trouser with a high, supportive waistband and full opacity. Studio-to-street coverage that moves like activewear. In Black and Brown.',
      fabric: 'KalFlex — 76% recycled nylon, 24% elastane. Squat-proof, opaque, four-way stretch.',
      reviews: [
        { name: 'Iqra D.', date: 'APR 2026', title: 'So flattering and they stay put', body: 'The waistband actually stays in place. Wore them to teach and then straight to the gym.' },
        { name: 'Leyla H.', date: 'JAN 2026', title: 'New everyday bottoms', body: 'Opaque, comfortable, and they do not cling. I basically live in these now.' }
      ]
    },
    {
      id: 'cargo-jogger', name: 'High-Waist Cargo Joggers', price: 50,
      category: 'bottoms', categoryLabel: 'BOTTOMS', collection: 'Performance Bottoms',
      colors: [BK, PL], sizes: FULL_SIZES, soldOut: '',
      rating: 4.8, reviewCount: 121, isNew: false, fabricTech: 'KalFlex',
      completeLook: ['biftu-full-tunic', 'mako-sport-hijab'],
      colorGalleries: [
        gal(['jogger-black-front.jpg', 'Front'], ['jogger-black-back.png', 'Back'], ['jogger-black-ghost.png', 'Ghost']),
        gal(['jogger-plum-front.jpg', 'Front'], ['jogger-plum-back.png', 'Back'], ['jogger-plum-ghost.png', 'Ghost'])
      ],
      blurb: 'High-waist cargo joggers with a tapered modest fit, deep side pockets and a secure waistband. Lightweight enough to train in, soft enough to live in. In Black and Plum.',
      fabric: 'BreezeLuxe — 80% recycled nylon, 20% elastane. Lightweight, breathable, quick-dry.',
      reviews: [
        { name: 'Fadumo S.', date: 'MAR 2026', title: 'Real pockets, finally', body: 'Lightweight joggers with deep pockets — perfect for travel days. Sizing was spot on.' },
        { name: 'Zainab M.', date: 'FEB 2026', title: 'Relaxed without looking sloppy', body: 'Soft and comfy but still put-together. The Plum is a beautiful colour.' }
      ]
    },
    // ----- SPORT HIJABS & SHAWLS -----
    {
      id: 'safiya-sport-hijab', name: 'Safiya Sport Hijab Pro 2.0', price: 25,
      category: 'hijabs-shawls', categoryLabel: 'SPORT HIJABS & SHAWLS', collection: 'The Performance Hijab Collection',
      colors: [BK], sizes: ['S/M', 'M/L'], soldOut: '',
      rating: 4.9, reviewCount: 214, isNew: true, fabricTech: 'KalFlex',
      completeLook: ['biftu-full-tunic', 'wide-leg-pant'],
      colorGalleries: [
        gal(['safiya-hijab-black.jpg', 'Front'])
      ],
      blurb: 'The Safiya Pro 2.0 — pull-on simplicity meets secure performance. No pins, no fuss, full coverage at the neckline, and two sizes for the perfect fit. In Black.',
      fabric: 'BreezeLuxe — 90% recycled polyester, 10% elastane. Moisture-wicking, four-way stretch, UPF 50+.',
      reviews: [
        { name: 'Hodan A.', date: 'MAY 2026', title: 'Does not budge', body: 'I ran 10k and never had to readjust it once. Breathable and so light I forget it is there.' },
        { name: 'Khadija O.', date: 'APR 2026', title: 'Two sizes is a game changer', body: 'I finally got a proper fit instead of one-size-fits-none. Full coverage at the neck too.' }
      ]
    },
    {
      id: 'safiya-sport-shawl', name: 'Safiya Sport Shawl', price: 25,
      category: 'hijabs-shawls', categoryLabel: 'SPORT HIJABS & SHAWLS', collection: 'The Performance Hijab Collection',
      colors: [BK, BR, PL], sizes: ['One Size'], soldOut: '',
      rating: 4.8, reviewCount: 88, isNew: false, fabricTech: 'KalFlex',
      completeLook: ['biftu-full-tunic', 'wide-leg-pant'],
      colorGalleries: [
        gal(['safiya-shawl-black.jpg', 'Front'], ['safiya-shawl-black-side.jpg', 'Side']),
        gal(['safiya-shawl-brown.jpg', 'Front'], ['safiya-shawl-brown-side.jpg', 'Side']),
        gal(['safiya-shawl-plum.jpg', 'Front'], ['safiya-shawl-plum-side.jpg', 'Side'])
      ],
      blurb: 'Designed to stay comfortably in place with a secure, pin-free fit — so you\'re ready for every workout, walk, and everyday adventure. In Black, Brown and Plum.',
      fabric: 'SolShield — 90% recycled polyester, 10% elastane. UPF 50+, quick-dry, anti-odour.',
      reviews: [
        { name: 'Munira H.', date: 'APR 2026', title: 'Beautiful drape', body: 'So easy to restyle and it goes straight from a workout to errands. Full coverage without the bulk.' },
        { name: 'Rahma D.', date: 'JAN 2026', title: 'Exactly what I wanted', body: 'Quick-drying and lightweight. The Plum colour is even better in person.' }
      ]
    },
    {
      id: 'mako-sport-hijab', name: 'Mako Sport Hijab Pro 2.0', price: 25,
      category: 'hijabs-shawls', categoryLabel: 'SPORT HIJABS & SHAWLS', collection: 'The Performance Hijab Collection',
      colors: [BK, RS, BL, NVB], sizes: ['One Size'], soldOut: '',
      rating: 4.8, reviewCount: 167, isNew: true, fabricTech: 'BreezeLuxe',
      completeLook: ['adna-mid-tunic', 'cargo-jogger'],
      colorGalleries: [
        gal(['mako-hijab-black.jpg', 'Front'], ['mako-hijab-black-side.jpg', 'Side']),
        gal(['mako-hijab-rose.jpg', 'Front']),
        gal(['mako-hijab-blue.jpg', 'Front'], ['mako-hijab-blue-side.jpg', 'Side']),
        gal(['mako-hijab-navy.jpg', 'Front'], ['mako-hijab-navy-side.jpg', 'Side'])
      ],
      blurb: 'The Mako Pro 2.0 — lightweight where it matters, secure where it counts. Moisture-wicking, breathable, and thoughtfully designed for all-day comfort. In Black, Rose, Blue and Navy Blue.',
      fabric: 'BreezeLuxe — 90% recycled polyester, 10% elastane. Quick-dry, anti-odour, breathable.',
      reviews: [
        { name: 'Sagal A.', date: 'MAY 2026', title: 'One-size that actually fits', body: 'Light enough that I forget I am wearing it during HIIT, and it stays put the whole class.' },
        { name: 'Ayan I.', date: 'MAR 2026', title: 'Want every colour', body: 'Four tones and I already have two. Breathable and the fit is so easy.' }
      ]
    },
    {
      id: 'mako-sport-shawl', name: 'Mako Sport Shawl Pro 2.0', price: 25,
      category: 'hijabs-shawls', categoryLabel: 'SPORT HIJABS & SHAWLS', collection: 'The Performance Hijab Collection',
      colors: [BK, RS, BL, NVB], sizes: ['One Size'], soldOut: '',
      rating: 4.7, reviewCount: 74, isNew: false, fabricTech: 'BreezeLuxe',
      completeLook: ['adna-mid-tunic', 'cargo-jogger'],
      colorGalleries: [
        gal(['mako-shawl-black.jpg', 'Front']),
        gal(['mako-shawl-rose.jpg', 'Front']),
        gal(['mako-shawl-blue.jpg', 'Front'], ['mako-shawl-blue-side.jpg', 'Side']),
        gal(['mako-shawl-navy.jpg', 'Front'])
      ],
      blurb: 'The Mako shawl Pro 2.0 — your movement, uninterrupted. A draped, full-coverage layer with four-way stretch and a secure fit that work together with every movement. In Black, Rose, Blue and Navy Blue.',
      fabric: 'SolShield — 90% recycled polyester, 10% elastane. UPF 50+, lightweight, breathable.',
      reviews: [
        { name: 'Asha M.', date: 'MAR 2026', title: 'My go-to layer', body: 'Soft, breathable and the colours are gorgeous. It does not slip around like other shawls.' },
        { name: 'Bilan K.', date: 'FEB 2026', title: 'Worth it', body: 'Lightweight and full coverage. I reach for this one more than any other.' }
      ]
    },
    // ----- BUNDLES (dedicated Bundles page + Shop Bundles tab) -----
    {
      id: 'core-set', name: 'The Core Set', price: 75, compareAt: 90, priceFrom: true,
      category: 'bundles', categoryLabel: 'BUNDLES', collection: 'Curated Bundles',
      colors: [BK], sizes: FULL_SIZES, soldOut: '',
      rating: 5.0, reviewCount: 63, isNew: true, fabricTech: 'KalFlex',
      bundle: true,
      includes: ['adna-mid-tunic', 'wide-leg-pant'],
      bundleOptions: [
        { label: 'Mid-Length Tunic + Pants', price: 85, compareAt: 100 },
        { label: 'Full-Length Tunic + Pants', price: 95, compareAt: 110 },
        { label: 'UPF Long Sleeve + Pants', price: 75, compareAt: 90 }
      ],
      bundleNote: 'Choose your top colour, bottom style (Wide-Leg Pants or Cargo Joggers), bottom colour, and size for each piece.',
      completeLook: [],
      colorGalleries: [
        gal([BUN + 'core-set-10.png', 'Set'], [BUN + 'core-set-14.png', 'Look 2'], [BUN + 'core-set-20.png', 'Look 3'], [BUN + 'core-set-11.png', 'Look 4'])
      ],
      blurb: 'Every great outfit starts with a strong foundation. Pair your favorite Kalsoni top with your choice of bottoms for a versatile set you’ll wear on repeat.',
      fabric: 'Matched performance knit. Moisture-wicking, four-way stretch.',
      reviews: [
        { name: 'Yasmin A.', date: 'MAY 2026', title: 'The easiest way to get dressed', body: 'Picked the mid-length tunic with wide-legs and I have worn the set three times this week already.' },
        { name: 'Halima N.', date: 'MAR 2026', title: 'Such good value', body: 'Buying the set saved me money and the pieces look made for each other.' }
      ]
    },
    {
      id: 'signature-adna', name: 'The Signature Black Set — Adna', price: 110, compareAt: 125,
      category: 'bundles', categoryLabel: 'BUNDLES', collection: 'Curated Bundles',
      colors: [BK], sizes: FULL_SIZES, soldOut: '',
      rating: 4.9, reviewCount: 41, isNew: true, fabricTech: 'KalFlex',
      bundle: true,
      includes: ['adna-mid-tunic', 'cargo-jogger', 'mako-sport-hijab'],
      bundleOptions: [
        { label: 'Set with Sport Hijab', price: 110, compareAt: 125 },
        { label: 'Set with Sport Shawl', price: 110, compareAt: 125 }
      ],
      bundleNote: 'Adna Mid-Length Tunic, your choice of Wide-Leg Pants or Cargo Joggers, and performance headwear. All in Black.',
      completeLook: [],
      colorGalleries: [
        gal([BUN + 'sig-mid-4a.png', 'Set'], [BUN + 'sig-mid-5.png', 'Look 2'], [BUN + 'sig-mid-6.png', 'Look 3'], [BUN + 'sig-mid-7.png', 'Look 4'])
      ],
      blurb: 'Everything you need to move with confidence: an Adna Mid-Length Tunic, your choice of bottoms, and performance headwear. Three thoughtfully designed pieces. One complete outfit.',
      fabric: 'Matched performance knit. Moisture-wicking, four-way stretch.',
      reviews: [
        { name: 'Sahra L.', date: 'APR 2026', title: 'Perfect intro to the brand', body: 'The tunic, bottoms and hijab arrived as one look. Great quality for the price.' },
        { name: 'Deqa F.', date: 'FEB 2026', title: 'Lovely gift', body: 'Bought it for my sister and she wears it constantly. Easy, thoughtful gift.' }
      ]
    },
    {
      id: 'signature-biftu', name: 'The Signature Black Set — Biftu', price: 120, compareAt: 135,
      category: 'bundles', categoryLabel: 'BUNDLES', collection: 'Curated Bundles',
      colors: [BK], sizes: FULL_SIZES, soldOut: '',
      rating: 4.9, reviewCount: 38, isNew: true, fabricTech: 'KalFlex',
      bundle: true,
      includes: ['biftu-full-tunic', 'cargo-jogger', 'safiya-sport-hijab'],
      bundleOptions: [
        { label: 'Set with Sport Hijab', price: 120, compareAt: 135 },
        { label: 'Set with Sport Shawl', price: 120, compareAt: 135 }
      ],
      bundleNote: 'Biftu Full-Length Tunic, your choice of Wide-Leg Pants or Cargo Joggers, and performance headwear. All in Black.',
      completeLook: [],
      colorGalleries: [
        gal([BUN + 'sig-full-2.png', 'Set'], [BUN + 'sig-full-3.png', 'Look 2'], [BUN + 'sig-full-8.png', 'Look 3'], [BUN + 'sig-full-9.png', 'Look 4'])
      ],
      blurb: 'Complete coverage, thoughtfully coordinated. Choose a Biftu Full-Length Tunic, your preferred bottoms, and performance headwear for one complete outfit.',
      fabric: 'Matched performance knit. Moisture-wicking, four-way stretch.',
      reviews: [
        { name: 'Amina H.', date: 'MAY 2026', title: 'Full coverage, one click', body: 'The full-length tunic with the joggers and hijab is the uniform I wanted. Everything matches.' },
        { name: 'Layla M.', date: 'APR 2026', title: 'Worth the set', body: 'Better value than buying separately and I did not have to guess what goes together.' }
      ]
    },
    {
      id: 'core-duo', name: 'The Core Duo', price: 85, compareAt: 100, priceFrom: true,
      category: 'bundles', categoryLabel: 'BUNDLES', collection: 'Curated Bundles',
      colors: [BK], sizes: FULL_SIZES, soldOut: '',
      rating: 4.9, reviewCount: 57, isNew: true, fabricTech: 'KalFlex',
      bundle: true,
      includes: ['adna-mid-tunic', 'biftu-full-tunic'],
      bundleOptions: [
        { label: 'Two Mid-Length Tunics', price: 85, compareAt: 100 },
        { label: 'Two Full-Length Tunics', price: 105, compareAt: 120 },
        { label: 'One Mid-Length + One Full-Length', price: 95, compareAt: 110 }
      ],
      bundleNote: 'Choose the colour and size of each top separately.',
      completeLook: [],
      colorGalleries: [
        gal([BUN + 'core-duo-16.png', 'Set'], [BUN + 'core-duo-18.png', 'Look 2'], [BUN + 'core-duo-17.png', 'Look 3'], [BUN + 'core-duo-19.png', 'Look 4'])
      ],
      blurb: 'Because one favorite is never enough. Choose two Kalsoni tops designed to support different routines, coverage preferences, and ways of moving.',
      fabric: 'KalFlex performance knit across both tunics. Moisture-wicking, four-way stretch.',
      reviews: [
        { name: 'Ifrah B.', date: 'MAY 2026', title: 'Two lengths, sorted', body: 'Got a mid and a full-length. I reach for both depending on the day — the bundle made that easy.' },
        { name: 'Warda H.', date: 'JAN 2026', title: 'Exactly what I wanted', body: 'Two tunics at a better price than buying them apart. More of this please.' }
      ]
    }
  ];

  var FABRIC_META = {
    KalFlex: {
      slug: 'kalflex',
      label: 'KALFLEX™',
      title: 'KALFLEX™ Performance Fabric',
      kicker: '01 — STRETCH',
      summary: 'Four-way stretch with an elegant drape that holds its shape.',
      blurb: 'Soft, four-way-stretch, and sweat-wicking, with a drape that keeps its shape.',
      description: 'Soft and smooth with an elegant drape that keeps its shape. Four-way stretch moves without restriction; sweat-wicking, breathable, and pill-resistant, it stays polished through training, travel, and repeat wear.',
      benefits: [
        'Four-way stretch that moves without restriction',
        'Sweat-wicking and breathable',
        'Pill-resistant through repeat wear',
        'Elegant drape that keeps its shape'
      ],
      uses: ['Gym and studio training', 'Yoga and dynamic movement', 'Leisure walks', 'Travel and everyday wear'],
      care: 'Machine wash cold with like colors, gentle cycle. Do not bleach or use fabric softener. Hang or lay flat to dry. Cool iron or steam if needed.',
      image: CAT + 'adna-black-front.jpg',
      imageAlt: 'Adna Mid-Length Tunic in KalFlex',
      video: ''
    },
    BreezeLuxe: {
      slug: 'breezeluxe',
      label: 'BREEZELUXE™',
      title: 'BREEZELUXE™ Performance Mesh',
      kicker: '02 — BREATHABILITY',
      summary: 'Ultra-lightweight mesh with airflow-based cooling.',
      blurb: 'Ultra-lightweight mesh built for maximum airflow and a constant cooling feel.',
      description: 'An ultra-lightweight mesh engineered for maximum airflow and a constant cooling feel. Four-way stretch and sweat-wicking, quick-drying performance keep you cool and dry through high-intensity training and warm-weather sessions.',
      benefits: [
        'Ultra-lightweight mesh for maximum airflow',
        'Constant cooling feel from ventilation, not coating',
        'Sweat-wicking and quick-drying',
        'Four-way stretch for high-intensity movement'
      ],
      uses: ['Running and intervals', 'Cycling', 'HIIT and high-impact training', 'Warm-weather sessions'],
      care: 'Machine wash cold with like colors, gentle cycle. Do not bleach, iron, or use fabric softener. Hang or lay flat to dry.',
      image: CAT + 'mako-hijab-black.jpg',
      imageAlt: 'Mako Sport Hijab Pro 2.0 in BreezeLuxe',
      video: ''
    },
    SolShield: {
      slug: 'solshield',
      label: 'SOLSHIELD™',
      title: 'SOLSHIELD™ UPF 50+ Fabric',
      kicker: '03 — PROTECTION',
      summary: 'UPF 50+ coverage with a cool-to-the-touch feel.',
      blurb: 'UPF 50+ protection with a smooth, cool-to-the-touch feel.',
      description: 'Lightweight, durable, and smooth against the skin, with a subtle sheen and a cool-to-the-touch feel. SolShield blocks 98% of UV rays while four-way stretch and sweat-wicking performance keep you covered — not weighed down — through outdoor training and long days in the sun.',
      benefits: [
        'UPF 50+ protection — blocks 98% of UV rays',
        'Cool-to-the-touch feel',
        'Lightweight, durable coverage with a subtle sheen',
        'Four-way stretch and sweat-wicking performance'
      ],
      uses: ['Outdoor training', 'Running', 'Active travel', 'Long days in the sun'],
      care: 'Machine wash cold with like colors, gentle cycle. Do not bleach or use fabric softener. Hang or lay flat to dry. Cool iron if needed.',
      image: CAT + 'upf-black-front.png',
      imageAlt: 'UPF 50+ Long-Sleeve Performance Shirt in SolShield',
      video: ''
    }
  };
  var FABRIC_ORDER = ['KalFlex', 'BreezeLuxe', 'SolShield'];
  var PDP_SHIPPING = 'Free U.S. shipping on orders of $125 or more. Final delivery, exchange, and return terms will appear here from Shopline.';

  var pdpCopy = {
    'adna-mid-tunic': {
      description: 'Coverage that performs. The Adna Mid-Length Tunic pairs a relaxed cut that drapes away from the body with our four-way-stretch, sweat-wicking KalFlex — mid-length coverage engineered to hold its shape from warm-up to cool-down.\n\nNamed after one of the girls I coached — the players who gave me my why.',
      features: [
        'Mid-length coverage with a relaxed, loose fit',
        'Mock neck with quarter zip',
        'Three pockets: two front, one sleeve',
        'Side zips for range of motion',
        'Thumbholes keep sleeves in place',
        'Swim-friendly'
      ],
      why: [
        'Mid-length coverage with a relaxed, loose fit',
        'Breathable, sweat-wicking KalFlex™',
        'Four-way stretch with an opaque finish',
        'Thumbholes and three zip pockets: two front, one sleeve'
      ],
      fit: 'Designed for a relaxed, coverage-first fit. Choose your usual Kalsoni size. If you prefer additional room through the hips, compare your measurements with the garment size guide before ordering.',
      detailsLead: 'Mock neck with quarter zip, long sleeves with thumbholes, side zips for range of motion, and three zip pockets (two front, one sleeve). Swim-friendly.',
      namedAfter: 'Named after one of the girls I coached — the players who gave me my why.'
    },
    'biftu-full-tunic': {
      description: 'Full coverage without the heavy feel. Our longest tunic, built in our four-way-stretch KalFlex. Side zips extend your stride; three pockets secure your essentials.\n\nNamed after a teammate who taught me what it means to show up for each other.',
      features: [
        'Full-length coverage with an elegant drape',
        'Mock neck with quarter zip',
        'Three pockets: two front, one sleeve',
        'Side zips for range of motion',
        'Thumbholes keep sleeves in place',
        'Swim-friendly'
      ],
      why: [
        'Full-length coverage with an elegant drape',
        'Built in our four-way-stretch KalFlex™',
        'Side zips extend your stride',
        'Thumbholes and three zip pockets: two front, one sleeve'
      ],
      fit: 'Designed for a relaxed, coverage-first fit. Choose your usual Kalsoni size. If you prefer additional room through the hips, compare your measurements with the garment size guide before ordering.',
      detailsLead: 'Mock neck with quarter zip, long sleeves with thumbholes, side zips for range of motion, and three zip pockets (two front, one sleeve). Swim-friendly.',
      namedAfter: 'Named after a teammate who taught me what it means to show up for each other.'
    },
    'wide-leg-pant': {
      description: 'Fluid coverage, functional storage. A supportive high rise and a wide leg with a fluid drape in our opaque, four-way-stretch KalFlex — with four pockets, including two hidden, that carry your essentials and keep the silhouette smooth.',
      features: [
        'Opaque coverage',
        'High-rise supportive waistband',
        'Wide-leg silhouette with a fluid drape',
        'Four pockets: two everyday, two hidden',
        'Moves from workouts to everyday wear'
      ],
      why: [
        'Opaque coverage',
        'High-rise supportive waistband',
        'Wide-leg silhouette with a fluid drape',
        'Four pockets: two everyday, two hidden'
      ],
      fit: 'High-rise, coverage-first fit. Choose your usual Kalsoni size. For extra room through the hips or a longer inseam preference, compare your measurements with the garment size guide before ordering.',
      detailsLead: 'High-rise waistband, wide leg with a fluid drape, and four pockets — two everyday, two hidden for secure storage.'
    },
    'cargo-jogger': {
      description: 'Built to carry more without slowing you down. A streamlined athletic fit in our four-way-stretch KalFlex with a six-pocket storage system — cargo, hidden, and everyday — constructed for training, travel, and every active day between.',
      features: [
        'Opaque coverage',
        'High-rise waistband',
        'Relaxed jogger fit with secure ankle finish',
        'Six pockets: two everyday, two hidden, two cargo'
      ],
      why: [
        'Opaque coverage',
        'High-rise waistband',
        'Relaxed jogger fit with secure ankle finish',
        'Six pockets: two everyday, two hidden, two cargo'
      ],
      fit: 'High-rise, coverage-first fit. Choose your usual Kalsoni size. For extra room through the hips or a longer inseam preference, compare your measurements with the garment size guide before ordering.',
      detailsLead: 'High-rise waistband, relaxed jogger fit with a secure ankle finish, and a six-pocket storage system — everyday, hidden, and cargo.'
    },
    'safiya-sport-hijab': {
      description: 'Instant coverage. Secure performance. Our four-way-stretch KalFlex and an integrated headband create a smooth, stay-put fit — no pins, no re-adjusting, from first sprint to final rep.\n\nNamed after one of the girls I coached — the players who gave me my why.',
      features: [
        'Instant, pin-free fit',
        'Integrated headband for a secure fit',
        'Smooth face opening',
        'Full neck and shoulder coverage',
        'Cut from surplus KalFlex from our tunic production',
        'Swim-friendly'
      ],
      why: [
        'Instant, pin-free fit',
        'Integrated headband for a secure fit',
        'Smooth face opening, full neck and shoulder coverage',
        'Cut from surplus KalFlex™ from our tunic production'
      ],
      fit: 'One-size design with four-way stretch for a secure, personalized fit. The integrated headband keeps everything in place without pins.',
      detailsLead: 'Integrated headband, smooth face opening, and full neck and shoulder coverage. Cut from surplus KalFlex from our tunic production. Swim-friendly.',
      namedAfter: 'Named after one of the girls I coached — the players who gave me my why.'
    },
    'safiya-sport-shawl': {
      description: 'A shawl engineered to stay where you put it. Integrated headband, button closure, and the soft drape of our four-way-stretch KalFlex that moves from errands to training to everything after.\n\nNamed after one of the girls I coached — the players who gave me my why.',
      features: [
        'Generous shawl-style coverage',
        'Wrap and tie-back styling',
        'Integrated headband for a secure fit',
        'Button closure keeps your hijab in place',
        'Cut from surplus KalFlex from our tunic production',
        'Ideal for low-impact training, yoga, and everyday wear',
        'Swim-friendly'
      ],
      why: [
        'Generous shawl-style coverage with wrap and tie-back styling',
        'Integrated headband for a secure fit',
        'Button closure keeps your hijab in place',
        'Cut from surplus KalFlex™ from our tunic production'
      ],
      fit: 'One-size design with four-way stretch for a secure, personalized fit. The integrated headband and button closure keep everything in place without pins.',
      detailsLead: 'Wrap silhouette with tie-back styling, integrated headband, and button closure. Cut from surplus KalFlex from our tunic production. Ideal for low-impact training, yoga, and everyday wear. Swim-friendly.',
      namedAfter: 'Named after one of the girls I coached — the players who gave me my why.'
    },
    'mako-sport-hijab': {
      description: 'High-airflow performance with extended front coverage. Our cooling BreezeLuxe mesh, a longer curved front, and a refined athletic fit — engineered for breathable security at competition intensity.\n\nNamed after one of the girls I coached — the players who gave me my why.',
      features: [
        'Longer curved front for added coverage',
        'Refined athletic cut with a comfortable, loose fit',
        'Smooth face opening',
        'Made with deadstock performance mesh',
        'Built for high-impact training and competition'
      ],
      why: [
        'Longer curved front for added coverage',
        'Refined athletic cut with a comfortable, loose fit',
        'Ultra-lightweight BreezeLuxe™ mesh, sweat-wicking and quick-drying',
        'Made with deadstock performance mesh'
      ],
      fit: 'One-size design with four-way stretch for a secure, personalized fit. The integrated headband keeps everything in place without pins.',
      detailsLead: 'Longer curved front, refined athletic cut, smooth face opening. Built for high-impact training and competition. Made with deadstock performance mesh.',
      namedAfter: 'Named after one of the girls I coached — the players who gave me my why.'
    },
    'mako-sport-shawl': {
      description: 'Cooling coverage in a versatile wrap. Our ultra-lightweight BreezeLuxe mesh keeps air moving; an integrated headband and button closure lock everything in place at full speed.\n\nNamed after one of the girls I coached — the players who gave me my why.',
      features: [
        'Generous shawl-style coverage',
        'Integrated headband for a secure fit',
        'Button closure keeps your hijab in place',
        'Made with deadstock performance mesh',
        'Designed for running, training, and warm-weather wear'
      ],
      why: [
        'Generous shawl-style coverage',
        'Integrated headband for a secure fit',
        'Button closure keeps your hijab in place',
        'Made with deadstock BreezeLuxe™ mesh'
      ],
      fit: 'One-size design with four-way stretch for a secure, personalized fit. The integrated headband and button closure keep everything in place without pins.',
      detailsLead: 'Wrap silhouette with integrated headband and button closure. Designed for running, training, and warm-weather wear. Made with deadstock performance mesh.',
      namedAfter: 'Named after one of the girls I coached — the players who gave me my why.'
    },
    'upf-long-sleeve': {
      description: 'Sun protection that keeps pace. Our lightweight SolShield blocks 98% of UV rays with a smooth, cool-to-the-touch feel — UPF 50+ flexibility without the stiffness of traditional sun layers.',
      features: [
        'UPF 50+ sun protection',
        'Cool-to-the-touch feel',
        'Lightweight, durable coverage',
        'Subtle sheen for an elevated finish',
        'Designed for outdoor training, running, and active travel'
      ],
      why: [
        'UPF 50+ sun protection — blocks 98% of UV rays',
        'Cool-to-the-touch feel',
        'Lightweight, durable coverage with a subtle sheen',
        'Four-way stretch for unrestricted movement'
      ],
      fit: 'Athletic fit with room to move. Choose your usual Kalsoni size; size up for a more relaxed layer over other pieces.',
      detailsLead: 'Long-sleeve coverage with a subtle sheen. Designed for outdoor training, running, and active travel.'
    },
    'zubeda-girls-tunic': {
      description: 'A girls’ performance tunic cut for movement and modest coverage. The same KalFlex knit as the adult line, sized for her.',
      features: [
        'Modest coverage cut for movement',
        'Soft, four-way-stretch KalFlex™',
        'Sweat-wicking performance knit'
      ],
      why: [
        'Coverage that keeps up with her',
        'Breathable, sweat-wicking KalFlex™',
        'Four-way stretch with an opaque finish'
      ],
      fit: 'Choose her usual size. If she is between sizes, compare measurements with the garment size guide and size up for extra room.',
      detailsLead: 'Performance tunic cut for movement and modest coverage.'
    }
  };

  // Per-colour galleries + a default gallery (first colour) for cards.
  products.forEach(function (p) {
    if (!p.colorGalleries) p.colorGalleries = colorGalleries(p.pool || [p.img], p.colors.length);
    p.gallery = p.colorGalleries[0];
    p.img = p.gallery[0].img;
    var meta = FABRIC_META[p.fabricTech];
    if (meta) p.fabric = meta.label + ' — ' + meta.blurb;
    p.pdp = pdpCopy[p.id] || null;
    if (!p.pdp && p.bundle) {
      p.pdp = {
        description: p.blurb,
        features: (p.bundleOptions || []).map(function (o) { return o.label; }),
        why: (p.bundleOptions || []).map(function (o) { return o.label; }),
        fit: p.bundleNote || 'Choose colours and sizes for each piece after adding to cart.',
        detailsLead: p.blurb
      };
    }
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
    { label: 'The Biftu Collection', cat: 'tops', blurb: 'Mid- and full-length tunics thoughtfully designed to give you the coverage you want with the freedom to move naturally.' },
    { label: 'Performance Bottoms', cat: 'bottoms', blurb: 'Wide-leg pants and cargo joggers designed to move comfortably through workouts, travel, errands, and everything in between.' },
    { label: 'The Performance Hijab Collection', cat: 'hijabs-shawls', blurb: 'Sport hijabs and shawls designed to stay put with a lightweight stretch that moves naturally with you — no pins, no fuss.' },
    { label: 'Curated Bundles', cat: 'bundles', blurb: 'Complete looks, priced as a set — thoughtfully designed so you can say yes to more.' }
  ];

  // Homepage "Shop the Collection" — four image-led cards.
  // Swap image / title / href for future campaigns.
  // TBD: client to supply final product or lifestyle images for each card.
  var shopCollection = {
    kicker: 'DESIGNED FOR THE WAY YOU CHOOSE TO MOVE',
    title: 'Shop the Collection',
    cards: [
      { title: 'Mid-Length Tunics', meta: 'Available in 3 colors', href: 'product.html?id=adna-mid-tunic', img: CAT + 'adna-black-front.jpg', imgAlt: 'Adna mid-length tunic', cta: 'Shop' },
      { title: 'Full-Length Tunics', meta: 'Available in 4 colors', href: 'product.html?id=biftu-full-tunic', img: CAT + 'biftu-black-front.png', imgAlt: 'Biftu full-length tunic', cta: 'Shop' },
      { title: 'Wide-Leg Pants', meta: 'Available in 2 colors', href: 'product.html?id=wide-leg-pant', img: CAT + 'wideleg-black-front.jpg', imgAlt: 'High waist wide-leg pants', cta: 'Shop' },
      { title: 'Bundles', meta: '4 curated sets', href: 'bundles.html', img: BUN + 'sig-mid-4a.png', imgAlt: 'Kalsoni bundles', cta: 'Shop' }
    ]
  };

  // Homepage sport hijab campaign — three-column: copy | still | video.
  // TBD still: dedicated sport-hijab product/lifestyle (catalog image is a stand-in).
  // TBD video: Drive sports folder clips are basketball, not hijab fit/movement.
  var hijabCampaign = {
    kicker: 'SPORT HIJABS & SHAWLS',
    headline: 'Your movement, uninterrupted.',
    description: 'Lightweight, breathable, and thoughtfully shaped for secure coverage through every rep, sprint, stretch, and everyday move.',
    ctaLabel: 'Shop Sport Hijabs',
    ctaHref: 'shop.html?cat=hijabs-shawls',
    image: CAT + 'safiya-shawl-black-side.jpg',
    imageAlt: 'Safiya Sport Shawl in Black',
    video: 'assets/kalsoni-video.mp4',
    videoPoster: CAT + 'mako-hijab-black.jpg'
  };

  // Homepage bundles section (data-driven cards; copy from the client mockup)
  var homeBundles = {
    kicker: 'BETTER TOGETHER',
    title: 'Your movement. Your way.',
    description: 'Choose the coverage, bottoms, and performance headwear that fit your routine and every way you move.',
    cards: [
      { id: 'core-set', eyebrow: 'EVERYDAY FOUNDATION', title: 'The Core Set', desc: 'Pair your preferred Kalsoni top with wide-leg pants or joggers.', cta: 'Build your Core Set' },
      { id: 'signature-adna', eyebrow: 'THREE-PIECE SET', title: 'The Adna Signature Set', desc: 'Mid-length tunic, wide-leg pants or joggers, and a sport hijab or shawl.', cta: 'Shop the Adna Set' },
      { id: 'signature-biftu', eyebrow: 'THREE-PIECE SET', title: 'The Biftu Signature Set', desc: 'Full-length tunic, wide-leg pants or joggers, and a sport hijab or shawl.', cta: 'Shop the Biftu Set' }
    ]
  };

  // Retail availability only — not partnerships or accelerators.
  var storeLocations = {
    kicker: 'RETAIL',
    title: 'Where to Shop Kalsoni',
    intro: 'The full collection lives on Kalsoni.com. Select pieces are also available at these REI Co-op stores.',
    note: 'In-store assortment may vary. Shop the complete range online.',
    online: {
      name: 'Kalsoni.com',
      blurb: 'The full collection, shipped to you — designed for wherever your day takes you. Free shipping on orders over $75.',
      href: 'shop.html',
      cta: 'Shop now'
    },
    stores: [
      {
        name: 'REI Co-op Bloomington',
        address: '750 American Blvd W',
        city: 'Bloomington, MN 55420',
        footerLine: '750 American Blvd W, MN 55420',
        map: 'https://www.google.com/maps/search/?api=1&query=REI+Bloomington+750+American+Blvd+W'
      },
      {
        name: 'REI Co-op Roseville',
        address: '1955 County Road B2 W',
        city: 'Roseville, MN 55113',
        footerLine: '1955 County Road B2 W, MN 55113',
        map: 'https://www.google.com/maps/search/?api=1&query=REI+Roseville+1955+County+Road+B2+W'
      }
    ]
  };

  // Homepage mission banner — full-width statement + CTA.
  // TBD image: Figma Lepa-style banner (to be exported and sent).
  var missionBanner = {
    statement: 'We believe every woman deserves the freedom to move as herself. Empowering more women to belong and thrive through movement.',
    emphasis: 'every woman deserves the freedom to move as herself',
    ctaLabel: 'OUR STORY',
    ctaHref: 'about.html',
    image: '',
    imageAlt: ''
  };

  // Shoppable Instagram / UGC (each post links to the product worn).
  var ugcPosts = [
    { img: CAT + 'mako-hijab-black.jpg', productId: 'mako-sport-hijab', handle: '@aminamoves' },
    { img: CAT + 'adna-plum-front.jpg', productId: 'adna-mid-tunic', handle: '@layla.runs' },
    { img: CAT + 'wideleg-brown-front.jpg', productId: 'wide-leg-pant', handle: '@sumaya.fit' },
    { img: CAT + 'safiya-hijab-black.jpg', productId: 'safiya-sport-hijab', handle: '@hodanactive' }
  ];

  // Editorial lookbook — the "drop" feeling, separate from Shop.
  var lookbook = {
    season: 'FW26 — THE DROP',
    title: 'Between Tides',
    intro: 'A study in movement and stillness. Our newest collection is built around layered coverage that breathes — designed for the in-between moments, from sunrise training to slow evenings.',
    hero: IMG.hero,
    blocks: [
      { kicker: 'CHAPTER 01', title: 'First Light', body: 'The Adna Tunic in Plum, layered over the High Waist Wide-Leg Pant. Built for the quiet, deliberate start of a day in motion.', img: CAT + 'adna-plum-front.jpg', productId: 'adna-mid-tunic' },
      { kicker: 'CHAPTER 02', title: 'In Motion', body: 'The Mako Sport Hijab stays put through every sprint and stretch — our most-worn piece, in four tones.', img: CAT + 'mako-hijab-black.jpg', productId: 'mako-sport-hijab' },
      { kicker: 'CHAPTER 03', title: 'After Hours', body: 'The full-length tunic and cargo joggers, styled to move from the studio to the street without missing a beat.', img: CAT + 'biftu-black-front.png', productId: 'biftu-full-tunic' }
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
        { type: 'p', html: 'The fabric has not changed — BreezeLuxe™, sweat-wicking, quick-drying. If your Black Mako fits, the new tones fit identically.' },
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
        { type: 'p', html: 'Before a single pattern was cut we spent a year on fabric. The brief sounded impossible: opaque at full stretch, soft enough for all-day wear, structured enough to drape instead of cling, and made responsibly. KalFlex™ was the fourth mill’s answer, and the moment we felt it we knew the tunic could exist.' },
        { type: 'img', src: IMG.top2, caption: 'KalFlex at full stretch — opaque, four-way, and soft on the skin.' },
        { type: 'h2', text: 'Then the fit' },
        { type: 'p', html: 'A modest cut that moves is a geometry problem. The side slits are set exactly where a deep squat needs them and nowhere else. The hem is weighted to fall back into place after a burpee. The neckline is high without touching the throat. Sixty-plus prototypes, tested by real women in real training — running, lifting, teaching, chasing kids — until the notes stopped coming back.' },
        { type: 'quote', text: 'The mid-length is perfect — full coverage but I can still do a deep squat without it riding up.', cite: 'Hodan A., verified buyer' },
        { type: 'h2', text: 'Two lengths, one idea' },
        { type: 'p', html: 'The tunic ships in two cuts: the Mid-Length, our do-everything original in five colours, and the Full-Length, which drapes to mid-thigh with thumbhole cuffs for maximum coverage. Same fabric, same testing, different lines on the body — because modesty is personal, and the choice should be yours.' },
        { type: 'shop', title: 'Shop the Biftu Collection', note: 'Both lengths, in every core colour.', ids: ['adna-mid-tunic', 'biftu-full-tunic'] }
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
        { type: 'shop', title: 'Build the looks', note: 'Everything styled above, available now.', ids: ['wide-leg-pant', 'adna-mid-tunic', 'mako-sport-hijab', 'mako-sport-shawl'] }
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
        { type: 'shop', title: 'Shop the bundles', note: 'Every set is priced below its pieces bought separately.', ids: ['core-set', 'signature-adna', 'signature-biftu', 'core-duo'] },
        { type: 'h2', text: 'What’s next' },
        { type: 'p', html: 'Later this year, bundles get per-piece size selection at checkout, seasonal colour stories that rotate with each drop, and a build-your-own flow that suggests coordinating colours as you pick. The goal: make the bundle the easiest way to shop Kalsoni, whether it is your first order or your fifth.' },
        { type: 'quote', text: 'Bought the Complete Set as my first Kalsoni order — every piece coordinated and arrived ready to wear.', cite: 'Yasmin A., verified buyer' },
        { type: 'signup', title: 'Bundle news first', body: 'Be the first to hear when the new bundle builder and seasonal sets go live.', cta: 'KEEP ME POSTED' }
      ]
    }
  ];

  function money(n) {
    var num = Number(n);
    return num % 1 === 0 ? '$' + num : '$' + num.toFixed(2);
  }
  function getPost(slug) {
    for (var i = 0; i < journalPosts.length; i++) if (journalPosts[i].slug === slug) return journalPosts[i];
    return journalPosts[0];
  }
  var PRODUCT_ALIAS = {
    'biftu-mid-tunic': 'adna-mid-tunic',
    'joggers': 'cargo-jogger',
    'complete-set': 'core-set',
    'starter-kit': 'signature-adna',
    'mix-match-3': 'core-duo'
  };
  function getProduct(id) {
    id = PRODUCT_ALIAS[id] || id;
    for (var i = 0; i < products.length; i++) if (products[i].id === id) return products[i];
    return products[0];
  }
  function getMany(ids) {
    return (ids || []).map(getProduct).filter(Boolean);
  }

  window.KALSONI = {
    IMG: IMG,
    campaignHero: campaignHero,
    products: products,
    reviews: reviews,
    sizeRows: sizeRows,
    collections: collections,
    shopCollection: shopCollection,
    hijabCampaign: hijabCampaign,
    homeBundles: homeBundles,
    storeLocations: storeLocations,
    missionBanner: missionBanner,
    ugcPosts: ugcPosts,
    lookbook: lookbook,
    journal: journal,
    journalPosts: journalPosts,
    fabricMeta: FABRIC_META,
    fabricOrder: FABRIC_ORDER,
    pdpShipping: PDP_SHIPPING,
    money: money,
    getProduct: getProduct,
    getPost: getPost,
    getMany: getMany
  };
})();
