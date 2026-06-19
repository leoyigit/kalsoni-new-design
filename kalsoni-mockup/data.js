/* ============================================================
   KALSONI — shared data layer
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

  var products = [
    { id: 'sport-hijab', name: 'Performance Sport Hijab', price: 38, category: 'hijabs', categoryLabel: 'SPORT HIJABS', img: IMG.blue, colors: [BK, SD, ST], sizes: ['One Size'], soldOut: '', rating: 4.9, reviewCount: 214, isNew: true, blurb: 'Our signature performance sport hijab — lightweight, breathable, and engineered to stay put through every rep, sprint and stretch. Moisture-wicking with a secure, comfortable fit.', fabric: '88% recycled polyester, 12% elastane. Moisture-wicking, four-way stretch, UPF 50+.' },
    { id: 'sport-shawl', name: 'Performance Sport Shawl', price: 42, category: 'hijabs', categoryLabel: 'SPORT HIJABS', img: IMG.shawl, colors: [BK, SL, CL], sizes: ['One Size'], soldOut: '', rating: 4.8, reviewCount: 96, isNew: true, blurb: 'A versatile performance shawl offering full coverage with effortless drape. Quick-drying and lightweight for high-intensity activity or all-day wear.', fabric: '90% recycled polyester, 10% elastane. Quick-dry, anti-odour finish.' },
    { id: 'signature-jacket', name: 'Kalsoni Signature Jacket', price: 88, category: 'jackets', categoryLabel: 'JACKETS', img: IMG.jacket, colors: [BK, SL, OL], sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], soldOut: 'XXL', rating: 4.9, reviewCount: 178, isNew: false, blurb: 'The jacket that started it all. Full-length coverage, a relaxed athletic cut, and the Kalsoni wordmark across the chest. Studio to street, built to move.', fabric: '82% nylon, 18% elastane. Brushed interior, four-way stretch, water-resistant.' },
    { id: 'sidezip-jacket', name: 'Side-Zip Active Jacket', price: 84, category: 'jackets', categoryLabel: 'JACKETS', img: IMG.hijab1, colors: [BK, SD, SL], sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], soldOut: 'XS', rating: 4.7, reviewCount: 64, isNew: false, blurb: 'Clean lines, hidden side zips for easy layering, and a longline silhouette for full coverage. A modern essential for cooler training days.', fabric: '80% recycled nylon, 20% elastane. Wind-resistant, breathable.' },
    { id: 'fulllength-top', name: 'Full-Length Modest Top', price: 58, category: 'tops', categoryLabel: 'TOPS', img: IMG.top1, colors: [BK, IV, CL], sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], soldOut: '', rating: 4.8, reviewCount: 142, isNew: false, blurb: 'A full-length, long-sleeve top with thumbholes and a high neck for complete coverage that never restricts. Layer it or wear it solo.', fabric: '92% recycled polyester, 8% elastane. Soft-touch, breathable knit.' },
    { id: 'everyday-tee', name: 'Everyday Modest Tee', price: 44, category: 'tops', categoryLabel: 'TOPS', img: IMG.top2, colors: [BK, IV, SD, OL], sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], soldOut: '', rating: 4.9, reviewCount: 201, isNew: true, blurb: 'The do-everything tee — relaxed through the body, longline hem, three-quarter coverage sleeves. Buttery soft and endlessly wearable.', fabric: '95% organic cotton, 5% elastane. Pre-shrunk, breathable.' },
    { id: 'motion-leggings', name: 'Motion Modest Leggings', price: 64, category: 'leggings', categoryLabel: 'LEGGINGS', img: IMG.confident, colors: [BK, SL, OL], sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], soldOut: '', rating: 4.9, reviewCount: 188, isNew: false, blurb: 'High-waisted, squat-proof and sculpting, with a wide supportive waistband. Full-length opacity you can trust through any movement.', fabric: '76% recycled nylon, 24% elastane. Squat-proof, four-way stretch.' },
    { id: 'movement-set', name: 'The Movement Set', price: 138, category: 'sets', categoryLabel: 'SETS', img: IMG.twogirls, colors: [BK, SL, CL], sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], soldOut: '', rating: 5.0, reviewCount: 73, isNew: true, blurb: 'Our coordinated two-piece — the Full-Length Top paired with Motion Leggings. A complete modest look, ready to move from sunrise workouts to errands.', fabric: 'Matched performance knit. Moisture-wicking, four-way stretch.' }
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
    { size: 'XXL', bust: '43–45', waist: '36–38', hip: '46–48' }
  ];

  var collections = [
    { label: 'Sport Hijabs', cat: 'hijabs', blurb: 'Engineered to stay put — lightweight, breathable coverage for every workout.' },
    { label: 'Tops', cat: 'tops', blurb: 'Full-coverage tops and tees that move with you, from studio to street.' },
    { label: 'Jackets', cat: 'jackets', blurb: 'Longline, layered silhouettes in performance fabric with modest cuts.' },
    { label: 'Leggings', cat: 'leggings', blurb: 'High-waisted, squat-proof and sculpting, with total opacity you can trust.' },
    { label: 'Sets', cat: 'sets', blurb: 'Coordinated two-piece looks, ready to move from sunrise to sundown.' }
  ];

  function money(n) { return '$' + Number(n).toFixed(2); }
  function getProduct(id) {
    for (var i = 0; i < products.length; i++) if (products[i].id === id) return products[i];
    return products[0];
  }

  window.KALSONI = {
    IMG: IMG,
    products: products,
    reviews: reviews,
    sizeRows: sizeRows,
    collections: collections,
    money: money,
    getProduct: getProduct
  };
})();
