/* ============================================================
   KALSONI — shared front-end app (v2)
   Header/footer/overlay injection, cart (localStorage),
   search, size guide, welcome popup, and per-page rendering.
   ============================================================ */
(function () {
  var K = window.KALSONI;
  var money = K.money;
  var CART_KEY = 'kalsoni-cart-v2';
  var WELCOME_KEY = 'kalsoni-welcome-v2';

  /* ---------- tiny helpers ---------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }
  function qparam(name) { return new URLSearchParams(window.location.search).get(name); }
  var STARS = '★★★★★';

  /* ---------- cart state ---------- */
  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { return []; }
  }
  function saveCart(cart) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) { }
    refreshChrome();
  }
  function cartCount() { return getCart().reduce(function (n, it) { return n + it.qty; }, 0); }
  function subtotal() { return getCart().reduce(function (n, it) { return n + it.price * it.qty; }, 0); }

  function addLine(p, colorIdx, size, qty, openDrawer, priceOverride) {
    var c = p.colors[colorIdx] || p.colors[0];
    var gallery = (p.colorGalleries && p.colorGalleries[colorIdx]) || p.gallery;
    var img = (gallery && gallery[0] && gallery[0].img) || p.img;
    var cart = getCart();
    var price = priceOverride != null ? priceOverride : p.price;
    var found = cart.filter(function (x) { return x.id === p.id && x.colorName === c.name && x.size === size; })[0];
    if (found) found.qty += qty;
    else cart.push({ id: p.id, name: p.name, price: price, colorName: c.name, colorHex: c.hex, size: size, qty: qty, img: img });
    saveCart(cart);
    if (openDrawer) openCart();
  }
  function quickAdd(id, colorIdx) {
    var p = K.getProduct(id);
    var ci = colorIdx == null ? 0 : +colorIdx;
    if (p.bundle) {
      var opt = (p.bundleOptions && p.bundleOptions[0]) || null;
      addLine(p, 0, opt ? opt.label : 'Set', 1, true, opt ? opt.price : p.price);
      toast('ADDED TO CART');
      return;
    }
    var size = p.sizes.filter(function (s) { return s !== p.soldOut; })[0] || p.sizes[0];
    addLine(p, ci, size, 1, true);
    toast('ADDED TO CART');
  }
  function changeQty(idx, delta) {
    var cart = getCart();
    if (!cart[idx]) return;
    cart[idx].qty += delta;
    if (cart[idx].qty <= 0) cart.splice(idx, 1);
    saveCart(cart);
    renderCartDrawer();
  }
  function removeItem(idx) {
    var cart = getCart();
    cart.splice(idx, 1);
    saveCart(cart);
    renderCartDrawer();
  }

  /* ---------- shared markup ---------- */
  function marqueeHTML() {
    var msg = '<span>FREE U.S. SHIPPING ON ORDERS $125+</span><span class="marquee__dot">&bull;</span>' +
      '<span>MORE COVERAGE. MORE FREEDOM TO MOVE.</span><span class="marquee__dot">&bull;</span>' +
      '<span>CERTIFIED B CORPORATION</span><span class="marquee__dot">&bull;</span>' +
      '<span>PERFORMANCE FABRIC, BUILT TO MOVE</span><span class="marquee__dot">&bull;</span>';
    return '<div class="marquee"><div class="marquee__track">' + msg + msg + '</div></div>';
  }

  // Certified B Corporation — official logo asset.
  function bCorpBadge(cls) {
    return '<img class="bcorp-logo ' + (cls || '') + '" src="assets/bcorp-logo.webp" ' +
      'alt="Certified B Corporation" width="90" loading="lazy" decoding="async">';
  }

  function headerHTML(active) {
    var shopCat = qparam('cat');
    function nav(href, label, on) {
      return '<a href="' + href + '"' + (on ? ' class="is-active"' : '') + '>' + label + '</a>';
    }
    var links =
      nav('shop.html', 'SHOP', active === 'shop' && shopCat !== 'bundles') +
      nav('bundles.html', 'BUNDLES', active === 'bundles' || (active === 'shop' && shopCat === 'bundles') || (active === 'product' && K.getProduct(qparam('id') || '').bundle)) +
      nav('blog.html', 'JOURNAL', active === 'journal' || active === 'journal-post') +
      nav('contact.html', 'CONTACT', active === 'contact');
    return '<header class="header"><div class="header__inner">' +
      '<div class="header__left">' +
      '<button class="iconbtn header__menu" type="button" data-open-nav aria-label="Open menu" aria-expanded="false">' +
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">' +
          '<line x1="4" y1="7" x2="20" y2="7"></line>' +
          '<line x1="4" y1="12" x2="20" y2="12"></line>' +
          '<line x1="4" y1="17" x2="20" y2="17"></line>' +
        '</svg>' +
      '</button>' +
      '<nav class="header__nav">' + links + '</nav>' +
      '</div>' +
      '<a href="index.html" class="header__logo">KALSONI</a>' +
      '<div class="header__actions">' +
      '<button class="iconbtn" data-open-search aria-label="Search"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.5" y2="16.5"></line></svg></button>' +
      '<a class="iconbtn header__account" href="contact.html" aria-label="Account"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="12" cy="8" r="4"></circle><path d="M5 21c0-4 3.5-6 7-6s7 2 7 6"></path></svg></a>' +
      '<button class="iconbtn" data-open-cart aria-label="Cart"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M6.5 8h11l-1 12.5h-9L6.5 8z"></path><path d="M9 8a3 3 0 0 1 6 0"></path></svg><span class="count" data-cart-count></span></button>' +
      '</div>' +
      '</div></header>';
  }

  function footerHTML() {
    return '<footer class="footer"><div class="footer__inner"><div class="footer__cols">' +
      '<div><div class="footer__brand">KALSONI</div>' +
      '<p class="footer__about">Performance apparel designed so more women can participate with confidence.</p>' +
      '<div class="footer__social"><a href="https://www.instagram.com/kalsoniapparel/">INSTAGRAM</a><a href="https://www.facebook.com/kalsoniapparel/">FACEBOOK</a><a href="https://www.linkedin.com/company/kalsoni/">LINKEDIN</a></div></div>' +
      '<div><div class="footer__heading">HELP</div><div class="footer__links">' +
      '<button data-open-sizeguide type="button">Size Guide</button><a href="faq.html">FAQ</a><a href="shop.html">Shop</a><a href="bundles.html">Bundles</a><a href="stores.html">Find a Store</a><a href="contact.html">Contact Us</a><a href="fabric.html">Fabric Technology</a></div></div>' +
      '<div><div class="footer__heading">ABOUT</div><div class="footer__links">' +
      '<a href="about.html">Who We Are</a><a href="lookbook.html">Lookbook</a><a href="blog.html">Journal</a><a href="wholesale.html">Wholesale</a><a href="wholesale.html#bulk">Bulk Orders (Schools &amp; Teams)</a><a href="affiliate.html">Affiliate Program</a></div></div>' +
      '<div class="footer__bcorp">' + bCorpBadge() + '</div>' +
      '<div><a class="footer__heading" href="stores.html">FIND A STORE</a><div class="footer__stores">' +
      (K.storeLocations.stores.map(function (s) {
        return esc(s.name) + '<br><span>' + esc(s.footerLine) + '</span>';
      }).join('<br><br>')) +
      '</div></div>' +
      '</div><div class="footer__bottom"><span>&copy; 2026 KALSONI. ALL RIGHTS RESERVED.</span>' +
      '<span class="legal"><a href="#">PRIVACY POLICY</a><a href="#">TERMS OF SERVICE</a></span>' +
      '<span class="footer__powered">Designed & Powered by <a href="https://www.powercommerce.com" target="_blank" rel="noopener">Power Commerce</a></span></div></div></footer>';
  }

  var WELCOME_ACTIVITIES = ['Running', 'Gym & Lifting', 'Yoga & Pilates', 'Hiking', 'Team Sports', 'Everyday'];

  function overlaysHTML() {
    return (
      // mobile nav
      '<div class="overlay" data-nav hidden>' +
      '<div class="overlay__scrim" data-close-nav></div>' +
      '<nav class="nav-sheet" aria-label="Mobile">' +
      '<div class="nav-sheet__head"><span>MENU</span>' +
      '<button data-close-nav aria-label="Close menu">CLOSE</button></div>' +
      '<div class="nav-sheet__links">' +
      '<a href="shop.html">Shop</a>' +
      '<a href="bundles.html">Bundles</a>' +
      '<a href="blog.html">Journal</a>' +
      '<a href="about.html">Our Story</a>' +
      '<a href="stores.html">Find a Store</a>' +
      '<a href="contact.html">Contact</a>' +
      '</div>' +
      '</nav>' +
      '</div>' +
      // search
      '<div class="overlay" data-search hidden>' +
      '<div class="overlay__scrim" data-close-search></div>' +
      '<div class="search-panel"><div class="search-panel__inner">' +
      '<div class="search-panel__bar">' +
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.5" y2="16.5"></line></svg>' +
      '<input type="text" name="q" data-search-input placeholder="Search tunics, hijabs, bundles…">' +
      '<button data-close-search>CLOSE</button>' +
      '</div><div data-search-results></div>' +
      '</div></div>' +
      '</div>' +
      // cart drawer
      '<div class="overlay" data-cart hidden>' +
      '<div class="overlay__scrim" data-close-cart></div>' +
      '<aside class="drawer">' +
      '<div class="drawer__head"><span>YOUR CART (<span data-cart-count>0</span>)</span>' +
      '<button data-close-cart aria-label="Close" class="x"><svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.4"><line x1="5" y1="5" x2="19" y2="19"></line><line x1="19" y1="5" x2="5" y2="19"></line></svg></button></div>' +
      '<div data-cart-body class="drawer__body"></div>' +
      '</aside>' +
      '</div>' +
      // size guide
      '<div class="overlay overlay--center" data-sizeguide hidden>' +
      '<div class="overlay__scrim" data-close-sizeguide></div>' +
      '<div class="modal"><div class="modal__head"><h3>Size Guide</h3><button data-close-sizeguide>CLOSE</button></div>' +
      '<p class="modal__note">Measurements in inches. For a relaxed, modest fit, size up. Between sizes? Go with the larger.</p>' +
      '<div class="sizetable"><div class="sizetable__head"><div>SIZE</div><div>BUST</div><div>WAIST</div><div>HIP</div></div>' +
      K.sizeRows.map(function (r) { return '<div class="sizetable__row"><div>' + r.size + '</div><div>' + r.bust + '</div><div>' + r.waist + '</div><div>' + r.hip + '</div></div>'; }).join('') +
      '</div></div>' +
      '</div>' +
      // welcome popup (Oiselle-style — activities + email capture)
      '<div class="overlay overlay--center" data-welcome hidden>' +
      '<div class="overlay__scrim" data-close-welcome></div>' +
      '<div class="welcome">' +
      '<button class="welcome__x" data-close-welcome aria-label="Close"><svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><line x1="5" y1="5" x2="19" y2="19"></line><line x1="19" y1="5" x2="5" y2="19"></line></svg></button>' +
      '<span class="eyebrow">WELCOME TO KALSONI</span>' +
      '<h3>Get 10% off your first order</h3>' +
      '<p>Tell us how you like to move and we&rsquo;ll tailor your edit.</p>' +
      '<div class="welcome__chips">' + WELCOME_ACTIVITIES.map(function (a) { return '<button type="button" class="welcome__chip" data-welcome-chip>' + a + '</button>'; }).join('') + '</div>' +
      '<form class="welcome__form" data-welcome-form>' +
      '<input type="email" class="input" placeholder="Email address" required>' +
      '<button class="btn btn--solid" type="submit">UNLOCK 10% OFF</button>' +
      '</form>' +
      '<button class="welcome__skip" data-close-welcome type="button">No thanks, I&rsquo;ll pay full price</button>' +
      '</div>' +
      '</div>' +
      // toast
      '<div class="toast" data-toast hidden></div>'
    );
  }

  /* ---------- product card ---------- */
  function cardHTML(p) {
    return variantCardHTML(p, null);
  }

  function variantCardHTML(p, colorIndex) {
    var ci = colorIndex == null ? 0 : colorIndex;
    var gallery = (p.colorGalleries && p.colorGalleries[ci]) || p.gallery || [];
    var img = (gallery[0] && gallery[0].img) || p.img;
    var hoverImg = (gallery[1] && gallery[1].img) || (gallery.length ? gallery[gallery.length - 1].img : img);
    var color = p.colors[ci];
    var href = 'product.html?id=' + p.id + (color && p.colors.length ? '&color=' + encodeURIComponent(color.name) : '');
    var dots = p.colors.map(function (c, i) {
      return '<span class="dot' + (i === ci ? ' is-active' : '') + '" style="background:' + c.hex + ';"></span>';
    }).join('');
    var tag;
    if (p.bundle) {
      tag = '<div class="card__colors">' + (p.bundleOptions ? p.bundleOptions.length + ' options' : (p.includes.length + '-piece set')) + '</div>';
    } else if (colorIndex != null) {
      tag = '<div class="card__colors">' + esc(color.name) + '</div>';
    } else {
      tag = p.colors.length > 1
        ? '<div class="card__colors">' + p.colors.length + ' Colors</div>'
        : '<div class="card__colors">&nbsp;</div>';
    }
    return '<article class="card' + (p.bundle ? ' card--bundle' : '') + '">' +
      '<a class="card__media" href="' + href + '">' +
      '<img class="card__img card__img--front" src="' + img + '" alt="' + esc(p.name) + (color ? ' — ' + esc(color.name) : '') + '" loading="lazy">' +
      '<img class="card__img card__img--hover" src="' + hoverImg + '" alt="" aria-hidden="true" loading="lazy">' +
      (p.isNew ? '<span class="card__badge">NEW</span>' : '') +
      '<button class="card__add" type="button" data-add="' + p.id + '" data-color="' + ci + '" aria-label="Quick add">+</button>' +
      '</a>' +
      '<a class="card__meta" href="' + href + '">' +
      '<div><div class="card__cat">' + p.categoryLabel + '</div><div class="card__name">' + esc(p.name) + '</div></div>' +
      '<div class="card__price">' + (p.priceFrom ? 'From ' : '') + money(p.price) + (p.compareAt ? ' <s class="card__was">' + money(p.compareAt) + '</s>' : '') + '</div>' +
      '</a>' +
      tag +
      '<div class="card__dots">' + dots + '</div>' +
      '</article>';
  }

  /* ---------- chrome refresh ---------- */
  function refreshChrome() {
    var n = cartCount();
    $all('[data-cart-count]').forEach(function (el) {
      el.textContent = n > 0 ? n : (el.closest('.drawer__head') ? '0' : '');
      el.style.display = (n > 0 || el.closest('.drawer__head')) ? '' : 'none';
    });
  }

  /* ---------- cart drawer render ---------- */
  function renderCartDrawer() {
    var body = $('[data-cart-body]');
    if (!body) return;
    var cart = getCart();
    if (cart.length === 0) {
      body.innerHTML = '<div class="drawer__empty"><div class="drawer__empty-title">Your cart is empty</div>' +
        '<button class="btn btn--solid" data-close-cart>CONTINUE SHOPPING</button></div>';
      return;
    }
    var sub = subtotal();
    var remaining = Math.max(0, 125 - sub);
    var pct = Math.min(100, sub / 125 * 100);
    var shipMsg = remaining > 0 ? ("You're " + money(remaining) + ' away from free shipping') : "You've unlocked free shipping";
    var items = cart.map(function (it, idx) {
      return '<div class="cartline">' +
        '<div class="cartline__media"><img src="' + it.img + '" alt="' + esc(it.name) + '"></div>' +
        '<div class="cartline__info">' +
        '<div class="cartline__top"><span>' + esc(it.name) + '</span><span>' + money(it.price * it.qty) + '</span></div>' +
        '<div class="cartline__meta">' + esc(it.colorName) + ' / ' + esc(it.size) + '</div>' +
        '<div class="cartline__bottom">' +
        '<div class="qty"><button data-dec="' + idx + '">−</button><span>' + it.qty + '</span><button data-inc="' + idx + '">+</button></div>' +
        '<button class="cartline__remove" data-remove="' + idx + '">REMOVE</button>' +
        '</div>' +
        '</div></div>';
    }).join('');
    body.innerHTML =
      '<div class="drawer__ship"><div class="drawer__ship-label">' + shipMsg + '</div>' +
      '<div class="drawer__ship-track"><div class="drawer__ship-fill" style="width:' + pct + '%"></div></div></div>' +
      '<div class="drawer__items">' + items + '</div>' +
      '<div class="drawer__foot">' +
      '<div class="drawer__sub"><span>SUBTOTAL</span><span>' + money(sub) + '</span></div>' +
      '<div class="drawer__tax">Shipping &amp; taxes calculated at checkout.</div>' +
      '<a class="btn btn--solid btn--full" href="checkout.html">CHECKOUT</a>' +
      '</div>';
  }

  /* ---------- overlays open/close ---------- */
  function openOverlay(sel) { var o = $(sel); if (o) { o.hidden = false; document.body.style.overflow = 'hidden'; } }
  function closeOverlay(sel) { var o = $(sel); if (o) { o.hidden = true; document.body.style.overflow = ''; } }
  function openCart() { renderCartDrawer(); openOverlay('[data-cart]'); }
  function openSearch() { openOverlay('[data-search]'); var i = $('[data-search-input]'); if (i) i.focus(); }
  function openNav() {
    openOverlay('[data-nav]');
    var b = $('[data-open-nav]');
    if (b) b.setAttribute('aria-expanded', 'true');
  }
  function closeNav() {
    closeOverlay('[data-nav]');
    var b = $('[data-open-nav]');
    if (b) b.setAttribute('aria-expanded', 'false');
  }
  function closeWelcome() { closeOverlay('[data-welcome]'); try { localStorage.setItem(WELCOME_KEY, '1'); } catch (e) { } }
  function maybeShowWelcome() {
    if (document.body.getAttribute('data-page') !== 'home') return;
    try { if (localStorage.getItem(WELCOME_KEY)) return; } catch (e) { }
    setTimeout(function () { var o = $('[data-welcome]'); if (o && o.hidden) o.hidden = false; }, 1400);
  }

  /* ---------- search ---------- */
  function renderSearch(q) {
    var box = $('[data-search-results]');
    if (!box) return;
    q = (q || '').trim().toLowerCase();
    if (!q) { box.innerHTML = ''; return; }
    var hits = K.products.filter(function (p) { return (p.name + ' ' + p.categoryLabel + ' ' + p.collection).toLowerCase().indexOf(q) > -1; });
    if (hits.length === 0) {
      box.innerHTML = '<div class="search-empty">No results for "' + esc(q) + '". Try "tunic", "hijab" or "bundle".</div>';
      return;
    }
    box.innerHTML = '<div class="search-results">' + hits.map(function (p) {
      return '<a class="search-row" href="product.html?id=' + p.id + '">' +
        '<div class="search-row__media"><img src="' + p.img + '" alt="' + esc(p.name) + '"></div>' +
        '<div class="search-row__info"><div>' + esc(p.name) + '</div><div class="search-row__cat">' + p.categoryLabel + '</div></div>' +
        '<div>' + money(p.price) + '</div></a>';
    }).join('') + '</div>';
  }

  /* ---------- toast ---------- */
  var toastT;
  function toast(msg) {
    var t = $('[data-toast]');
    if (!t) return;
    t.textContent = msg;
    t.hidden = false;
    t.classList.add('is-show');
    clearTimeout(toastT);
    toastT = setTimeout(function () { t.classList.remove('is-show'); setTimeout(function () { t.hidden = true; }, 300); }, 2400);
  }

  /* ============================================================
     PAGE RENDERERS
     ============================================================ */
  function renderHomeHero() {
    var root = $('#home-hero');
    var h = K.campaignHero;
    if (!root || !h) return;
    var layout = h.layout === 'overlay' ? 'overlay' : 'split';
    var align = h.align || 'top-left';
    var shots = (h.images && h.images.length) ? h.images : [{ src: h.image, alt: h.imageAlt, position: h.imagePosition }];
    var ctas = (h.ctas || []).map(function (c) {
      return '<a href="' + esc(c.href) + '">' + esc(c.label) + '</a>';
    }).join('');
    var media = shots.map(function (shot) {
      var pos = shot.position || 'center center';
      return '<div class="hero-campaign__media"><img src="' + esc(shot.src) + '" alt="' + esc(shot.alt || '') + '" style="object-position:' + esc(pos) + '"></div>';
    }).join('');
    root.className = 'hero-campaign hero-campaign--' + layout + ' hero-campaign--' + align +
      (shots.length > 1 ? ' hero-campaign--duo' : '');
    root.innerHTML = media +
      '<div class="hero-campaign__copy">' +
        (h.kicker ? '<span class="eyebrow">' + esc(h.kicker) + '</span>' : '') +
        '<h1>' + esc(h.headline) + '</h1>' +
        (h.sub ? '<p>' + esc(h.sub) + '</p>' : '') +
        (ctas ? '<div class="hero-campaign__cta">' + ctas + '</div>' : '') +
      '</div>';
  }

  function renderHome() {
    renderHomeHero();

    var shopCol = $('#shop-collection');
    var sc = K.shopCollection;
    if (shopCol && sc) {
      shopCol.innerHTML =
        '<div class="section-head"><div><span class="eyebrow">' + esc(sc.kicker) + '</span><h2>' + esc(sc.title) + '</h2></div></div>' +
        '<div class="shop-coll">' + sc.cards.map(function (c) {
          return '<a class="shop-coll__card" href="' + esc(c.href) + '">' +
            '<div class="shop-coll__media"><img src="' + esc(c.img) + '" alt="' + esc(c.imgAlt || c.title) + '" loading="lazy"></div>' +
            '<h3 class="shop-coll__title">' + esc(c.title) + '</h3>' +
            '<div class="shop-coll__meta">' +
              (c.meta ? '<span class="shop-coll__avail">' + esc(c.meta) + '</span>' : '') +
              '<span class="shop-coll__cta">' + esc(c.cta || 'Shop') + ' &rarr;</span>' +
            '</div>' +
            '</a>';
        }).join('') + '</div>';
    }

    var hijabRoot = $('#hijab-campaign');
    var hc = K.hijabCampaign;
    if (hijabRoot && hc) {
      var videoHtml = hc.video
        ? '<video autoplay muted loop playsinline poster="' + esc(hc.videoPoster || hc.image) + '" src="' + esc(hc.video) + '"></video>'
        : '<img src="' + esc(hc.videoPoster || hc.image) + '" alt="' + esc(hc.imageAlt || '') + '">';
      hijabRoot.innerHTML =
        '<div class="hijab-campaign__copy">' +
          (hc.kicker ? '<span class="eyebrow">' + esc(hc.kicker) + '</span>' : '') +
          '<h2>' + esc(hc.headline) + '</h2>' +
          (hc.description ? '<p class="hijab-campaign__desc">' + esc(hc.description) + '</p>' : '') +
          '<a class="link-underline hijab-campaign__cta" href="' + esc(hc.ctaHref) + '">' + esc(hc.ctaLabel).toUpperCase() + ' &rarr;</a>' +
        '</div>' +
        '<div class="hijab-campaign__still"><img src="' + esc(hc.image) + '" alt="' + esc(hc.imageAlt || '') + '"></div>' +
        '<div class="hijab-campaign__video">' + videoHtml + '</div>';
    }

    var missionRoot = $('#about.mission-banner');
    var mb = K.missionBanner;
    if (missionRoot && mb) {
      var bg = mb.image
        ? '<img class="mission-banner__bg" src="' + esc(mb.image) + '" alt="' + esc(mb.imageAlt || '') + '">'
        : '';
      missionRoot.classList.toggle('mission-banner--photo', !!mb.image);
      var stmt = esc(mb.statement);
      if (mb.emphasis) {
        var needle = esc(mb.emphasis);
        var i = stmt.indexOf(needle);
        if (i !== -1) {
          stmt = stmt.slice(0, i) + '<span class="mission-banner__em">' + needle + '</span>' + stmt.slice(i + needle.length);
        }
      }
      missionRoot.innerHTML = bg +
        '<div class="mission-banner__inner">' +
          '<p class="mission-banner__statement">' + stmt + '</p>' +
          '<a class="btn btn--ghost" href="' + esc(mb.ctaHref) + '">' + esc(mb.ctaLabel) + '</a>' +
        '</div>';
    }

    // bundle-led merchandising (data.js → homeBundles)
    var bundleGrid = $('#bundle-grid');
    var hb = K.homeBundles;
    if (bundleGrid && hb) {
      bundleGrid.innerHTML =
        '<div class="section-head">' +
          '<div><span class="eyebrow">' + esc(hb.kicker) + '</span><h2>' + esc(hb.title) + '</h2></div>' +
          '<p class="section-head__desc">' + esc(hb.description) + '</p>' +
        '</div>' +
        '<div class="hbundle-grid">' + hb.cards.map(function (b) {
          var p = K.getProduct(b.id);
          var href = 'product.html?id=' + b.id;
          var price = (p.priceFrom ? 'From ' : '') + K.money(p.price);
          return '<article class="hbundle">' +
            '<a class="hbundle__media" href="' + href + '"><img src="' + esc(p.img) + '" alt="' + esc(b.title) + '" loading="lazy"></a>' +
            '<div class="hbundle__body">' +
              '<span class="hbundle__eyebrow">' + esc(b.eyebrow) + '</span>' +
              '<h3>' + esc(b.title) + '</h3>' +
              '<p>' + esc(b.desc) + '</p>' +
              '<div class="hbundle__price">' + price + '</div>' +
              '<a class="link-underline hbundle__cta" href="' + href + '">' + esc(b.cta).toUpperCase() + ' &rarr;</a>' +
            '</div>' +
          '</article>';
        }).join('') + '</div>';
    }

    // bestsellers
    var grid = $('#featured-grid');
    if (grid) grid.innerHTML = K.products.filter(function (p) { return !p.bundle && p.id !== 'zubeda-girls-tunic'; }).slice(0, 4).map(cardHTML).join('');

    // shoppable instagram / UGC
    var ugc = $('#ugc-grid');
    if (ugc) ugc.innerHTML = K.ugcPosts.map(function (u) {
      var p = K.getProduct(u.productId);
      return '<a class="ugc" href="product.html?id=' + p.id + '"><img src="' + u.img + '" alt="' + esc(p.name) + '" loading="lazy">' +
        '<div class="ugc__shade"></div><div class="ugc__tag"><span class="ugc__handle">' + u.handle + '</span>' +
        '<span class="ugc__shop">SHOP ' + esc(p.name) + ' &rarr;</span></div></a>';
    }).join('');

    renderWhereToShop('#where-shop', true);
  }

  function storeCardHTML(s) {
    return '<a class="where-card" href="' + esc(s.map) + '" target="_blank" rel="noopener">' +
      '<div class="where-card__kicker">IN STORE</div>' +
      '<h3>' + esc(s.name) + '</h3>' +
      '<p>' + esc(s.address) + '<br>' + esc(s.city) + '</p>' +
      '<span>Directions &rarr;</span>' +
      '</a>';
  }

  function renderWhereToShop(sel, compact) {
    var root = $(sel);
    var loc = K.storeLocations;
    if (!root || !loc) return;
    var online = loc.online;
    var head = compact
      ? '<div class="section-head--center"><span class="eyebrow">' + esc(loc.kicker) + '</span><h2>' + esc(loc.title) + '</h2></div>' +
        '<p class="where-shop__intro">' + esc(loc.intro) + '</p>'
      : '';
    var more = compact
      ? '<p class="where-shop__more"><a class="link-underline" href="stores.html">Store details &amp; directions &rarr;</a></p>'
      : '';
    root.innerHTML = head +
      '<div class="where-shop__grid">' +
        '<a class="where-card where-card--online" href="' + esc(online.href) + '">' +
          '<div class="where-card__kicker">ONLINE</div>' +
          '<h3>' + esc(online.name) + '</h3>' +
          '<p>' + esc(online.blurb) + '</p>' +
          '<span>' + esc(online.cta) + ' &rarr;</span>' +
        '</a>' +
        loc.stores.map(storeCardHTML).join('') +
      '</div>' + more;
  }

  function renderStores() {
    var root = $('#stores-page');
    var loc = K.storeLocations;
    if (!root || !loc) return;
    renderWhereToShop('#stores-page', false);
    root.insertAdjacentHTML('beforeend',
      '<p class="stores-page__note">' + esc(loc.note) + '</p>' +
      '<div class="stores-page__cta">' +
        '<a href="shop.html" class="btn btn--solid">SHOP ONLINE</a>' +
        '<a href="wholesale.html" class="link-underline">Retailers: become a stockist &rarr;</a>' +
      '</div>');
  }

  function renderFabric() {
    var root = $('#fabric-guide');
    if (!root) return;
    var order = K.fabricOrder || ['KalFlex', 'BreezeLuxe', 'SolShield'];
    var compare = '<div class="fabric-compare">' + order.map(function (key) {
      var f = K.fabricMeta[key];
      if (!f) return '';
      var count = K.products.filter(function (p) { return p.fabricTech === key && !p.bundle; }).length;
      return '<a class="fabric-compare__card" href="#' + f.slug + '">' +
        '<span class="eyebrow">' + esc(f.label) + '</span>' +
        '<p>' + esc(f.summary) + '</p>' +
        '<span>' + count + (count === 1 ? ' piece' : ' pieces') + ' &rarr;</span>' +
        '</a>';
    }).join('') + '</div>';

    var families = order.map(function (key, i) {
      var f = K.fabricMeta[key];
      if (!f) return '';
      var products = K.products.filter(function (p) { return p.fabricTech === key && !p.bundle; });
      var media = f.video
        ? '<video autoplay muted loop playsinline poster="' + esc(f.image) + '" src="' + esc(f.video) + '"></video>'
        : '<img src="' + esc(f.image) + '" alt="' + esc(f.imageAlt || f.title) + '" loading="lazy">';
      var benefits = (f.benefits || []).map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('');
      var uses = (f.uses || []).map(function (u) { return '<li>' + esc(u) + '</li>'; }).join('');
      return '<section class="fabric-family' + (i % 2 ? ' fabric-family--rev' : '') + '" id="' + esc(f.slug) + '">' +
        '<div class="fabric-family__inner">' +
          '<div class="fabric-family__hero">' +
            '<div class="fabric-family__media">' + media + '</div>' +
            '<div class="fabric-family__copy">' +
              '<span class="eyebrow">' + esc(f.kicker) + '</span>' +
              '<h2 class="fabric-name">' + esc(f.title) + '</h2>' +
              '<p>' + esc(f.description) + '</p>' +
            '</div>' +
          '</div>' +
          '<div class="fabric-family__facts">' +
            '<div><div class="fabric-family__k">PERFORMANCE BENEFITS</div><ul>' + benefits + '</ul></div>' +
            '<div><div class="fabric-family__k">BEST FOR</div><ul>' + uses + '</ul></div>' +
            '<div><div class="fabric-family__k">CARE</div><p>' + esc((f.care || '').replace(/^Care:\s*/i, '')) + '</p></div>' +
          '</div>' +
          (products.length ? '<div class="fabric-family__shop">' +
            '<div class="section-head"><div><span class="eyebrow">MADE WITH THIS FABRIC</span><h2>Shop ' + esc(f.label) + '</h2></div></div>' +
            '<div class="product-grid">' + products.map(cardHTML).join('') + '</div>' +
          '</div>' : '') +
        '</div>' +
      '</section>';
    }).join('');

    root.innerHTML = compare + families;
  }

  function renderShop() {
    var grid = $('#shop-grid');
    if (!grid) return;
    var state = { filter: qparam('cat') || 'all', sort: 'featured' };
    var filters = [['All', 'all'], ['Tops', 'tops'], ['Bottoms', 'bottoms'], ['Sport Hijabs & Shawls', 'hijabs-shawls'], ['Bundles', 'bundles']];
    var pillWrap = $('#shop-pills');
    var sortSel = $('#shop-sort');
    var resultEl = $('#shop-result');

    function draw() {
      var products = K.products.filter(function (p) {
        if (state.filter === 'all') return !p.bundle;
        return p.category === state.filter;
      }).slice();
      var list = [];
      products.forEach(function (p) {
        if (p.bundle) {
          list.push({ p: p, colorIndex: null });
        } else {
          p.colors.forEach(function (_, i) { list.push({ p: p, colorIndex: i }); });
        }
      });
      if (state.sort === 'price-asc') list.sort(function (a, b) { return a.p.price - b.p.price; });
      else if (state.sort === 'price-desc') list.sort(function (a, b) { return b.p.price - a.p.price; });
      else if (state.sort === 'newest') list.sort(function (a, b) { return (b.p.isNew ? 1 : 0) - (a.p.isNew ? 1 : 0); });
      grid.innerHTML = list.map(function (item) { return variantCardHTML(item.p, item.colorIndex); }).join('');
      if (resultEl) resultEl.textContent = list.length + (list.length === 1 ? ' STYLE' : ' STYLES');
      if (pillWrap) $all('button', pillWrap).forEach(function (b) { b.classList.toggle('is-active', b.dataset.filter === state.filter); });
    }
    if (pillWrap) {
      pillWrap.innerHTML = filters.map(function (f) {
        return '<button class="pill" data-filter="' + f[1] + '">' + f[0] + '</button>';
      }).join('');
      pillWrap.addEventListener('click', function (e) {
        var b = e.target.closest('[data-filter]'); if (!b) return;
        state.filter = b.dataset.filter; draw();
      });
    }
    if (sortSel) sortSel.addEventListener('change', function () { state.sort = sortSel.value; draw(); });
    draw();
  }

  function renderBundles() {
    var grid = $('#bundles-grid');
    if (!grid) return;
    var list = K.products.filter(function (p) { return p.bundle; });
    grid.innerHTML = list.map(function (p) {
      var price = (p.priceFrom ? 'From ' : '') + money(p.price);
      var was = p.compareAt ? '<s>' + money(p.compareAt) + '</s>' : '';
      return '<a class="bundle-tile" href="product.html?id=' + p.id + '">' +
        '<div class="bundle-tile__media"><img src="' + p.img + '" alt="' + esc(p.name) + '" loading="lazy"></div>' +
        '<div class="bundle-tile__body">' +
        '<span class="eyebrow">BUNDLE</span>' +
        '<h2>' + esc(p.name) + '</h2>' +
        '<div class="bundle-tile__price">' + price + ' ' + was + '</div>' +
        '<p>' + esc(p.blurb) + '</p>' +
        (p.bundleOptions ? '<ul class="bundle-tile__opts">' + p.bundleOptions.map(function (o) {
          return '<li>' + esc(o.label) + ' <span>' + money(o.price) + '</span></li>';
        }).join('') + '</ul>' : '') +
        '<span class="bundle-tile__cta">SHOP THE SET &rarr;</span>' +
        '</div></a>';
    }).join('');
  }

  function renderCollections() {
    var grid = $('#collections-grid');
    if (!grid) return;
    grid.innerHTML = K.collections.map(function (col) {
      var items = K.products.filter(function (p) { return p.category === col.cat; });
      var colorCount = items.reduce(function (n, p) { return n + (p.bundle ? 1 : p.colors.length); }, 0);
      var img = (items[0] || K.products[0]).img;
      var count = colorCount + (colorCount === 1 ? ' style' : ' styles');
      var href = col.cat === 'bundles' ? 'bundles.html' : 'shop.html?cat=' + col.cat;
      return '<a class="collection" href="' + href + '">' +
        '<div class="collection__media"><img src="' + img + '" alt="' + col.label + '" loading="lazy"><span class="collection__count">' + count + '</span></div>' +
        '<div class="collection__row"><div><h2>' + col.label + '</h2><p>' + col.blurb + '</p></div>' +
        '<span class="collection__shop">SHOP &rarr;</span></div></a>';
    }).join('');
  }

  function renderLookbook() {
    var root = $('#lookbook');
    if (!root) return;
    var lb = K.lookbook;
    document.title = lb.title + ' — Kalsoni Lookbook';
    var blocks = lb.blocks.map(function (b, i) {
      return '<div class="lb-block' + (i % 2 ? ' lb-block--rev' : '') + '">' +
        '<div class="lb-block__media"><img src="' + b.img + '" alt="' + esc(b.title) + '" loading="lazy"></div>' +
        '<div class="lb-block__copy"><span class="eyebrow">' + b.kicker + '</span><h2>' + esc(b.title) + '</h2>' +
        '<p>' + esc(b.body) + '</p><a class="link-underline" href="product.html?id=' + b.productId + '">SHOP THE LOOK &rarr;</a></div></div>';
    }).join('');
    root.innerHTML =
      '<section class="lb-hero"><img src="' + lb.hero + '" alt="' + esc(lb.title) + '">' +
      '<div class="lb-hero__copy"><span class="eyebrow">' + lb.season + '</span><h1>' + esc(lb.title) + '</h1>' +
      '<p>' + esc(lb.intro) + '</p></div></section>' +
      '<section class="lb-blocks">' + blocks + '</section>' +
      '<section class="faq-cta" style="border-top:1px solid var(--line);"><h2>Shop the collection</h2>' +
      '<p>Every look is available now — modest coverage that performs.</p><a href="shop.html" class="btn btn--solid">SHOP ALL</a></section>';
  }

  function renderJournal() {
    var root = $('#journal');
    if (!root) return;
    var posts = K.journal;
    var feat = posts[0];
    var rest = posts.slice(1);
    root.innerHTML =
      '<div class="page-head"><span class="eyebrow">THE JOURNAL</span><h1>New &amp; upcoming</h1>' +
      '<p>A first look at new drops, fresh colourways, and the stories behind the pieces.</p></div>' +
      '<a class="journal-feat" href="journal-post.html?post=' + feat.slug + '">' +
      '<div class="journal-feat__media"><img src="' + feat.img + '" alt="' + esc(feat.title) + '"><span class="journal-card__kicker">' + feat.kicker + '</span></div>' +
      '<div class="journal-feat__copy"><span class="journal-card__date">' + feat.date + '</span>' +
      '<h2>' + esc(feat.title) + '</h2><p>' + esc(feat.excerpt) + '</p><span class="link-underline">READ THE STORY &rarr;</span></div></a>' +
      '<div class="journal-grid">' + rest.map(function (po) {
        return '<a class="journal-card" href="journal-post.html?post=' + po.slug + '">' +
          '<div class="journal-card__media"><img src="' + po.img + '" alt="' + esc(po.title) + '" loading="lazy"><span class="journal-card__kicker">' + po.kicker + '</span></div>' +
          '<div class="journal-card__date">' + po.date + '</div><h3>' + esc(po.title) + '</h3><p>' + esc(po.excerpt) + '</p></a>';
      }).join('') + '</div>';
  }

  function renderJournalPost() {
    var root = $('#journal-post');
    if (!root) return;
    var post = K.getPost(qparam('post') || '');
    document.title = post.title + ' — The Kalsoni Journal';

    function blockHTML(b) {
      if (b.type === 'p') return '<p>' + b.html + '</p>';
      if (b.type === 'h2') return '<h2>' + esc(b.text) + '</h2>';
      if (b.type === 'img') return '<figure class="post-fig"><img src="' + b.src + '" alt="' + esc(b.caption || post.title) + '" loading="lazy">' +
        (b.caption ? '<figcaption>' + esc(b.caption) + '</figcaption>' : '') + '</figure>';
      if (b.type === 'quote') return '<blockquote class="post-quote"><p>&ldquo;' + esc(b.text) + '&rdquo;</p>' +
        (b.cite ? '<cite>' + esc(b.cite) + '</cite>' : '') + '</blockquote>';
      if (b.type === 'shop') {
        var items = K.getMany(b.ids);
        return '<div class="post-shop"><div class="post-shop__head"><span class="eyebrow">' + esc(b.title || 'Shop the story') + '</span>' +
          (b.note ? '<p>' + esc(b.note) + '</p>' : '') + '</div>' +
          '<div class="post-shop__grid post-shop__grid--' + Math.min(items.length, 4) + '">' + items.map(cardHTML).join('') + '</div></div>';
      }
      if (b.type === 'signup') {
        return '<div class="post-signup"><span class="eyebrow">' + esc(post.kicker) + '</span><h3>' + esc(b.title) + '</h3>' +
          '<p>' + esc(b.body) + '</p>' +
          '<form class="post-signup__form" data-toast-form="THANKS — YOU\'RE ON THE LIST">' +
          '<input type="email" name="email" class="input" placeholder="Email address" required>' +
          '<button class="btn btn--solid" type="submit">' + esc(b.cta || 'SIGN UP') + '</button></form></div>';
      }
      return '';
    }

    var more = K.journal.filter(function (j) { return j.slug !== post.slug; }).slice(0, 3);

    root.innerHTML =
      '<div class="post-hero"><img src="' + post.hero + '" alt="' + esc(post.title) + '"></div>' +
      '<article class="post">' +
      '<div class="post-head">' +
      '<div class="post-head__crumb"><a href="blog.html">THE JOURNAL</a> &nbsp;/&nbsp; <span>' + post.kicker + '</span></div>' +
      '<h1>' + esc(post.title) + '</h1>' +
      '<div class="post-head__date">' + post.date + '</div>' +
      '<p class="post-standfirst">' + esc(post.standfirst) + '</p>' +
      '</div>' +
      '<div class="post-body">' + post.blocks.map(blockHTML).join('') + '</div>' +
      '</article>' +
      '<section class="post-more"><div class="section-head--center"><span class="eyebrow">KEEP READING</span><h2>More from the Journal</h2></div>' +
      '<div class="journal-grid journal-grid--flush">' + more.map(function (po) {
        return '<a class="journal-card" href="journal-post.html?post=' + po.slug + '">' +
          '<div class="journal-card__media"><img src="' + po.img + '" alt="' + esc(po.title) + '" loading="lazy"><span class="journal-card__kicker">' + po.kicker + '</span></div>' +
          '<div class="journal-card__date">' + po.date + '</div><h3>' + esc(po.title) + '</h3><p>' + esc(po.excerpt) + '</p></a>';
      }).join('') + '</div></section>';
  }

  function fabricMeta(tech) {
    return (K.fabricMeta && K.fabricMeta[tech]) || null;
  }
  function fabricHref(tech) {
    var m = fabricMeta(tech);
    return m ? 'fabric.html#' + m.slug : 'fabric.html';
  }
  function fabricLinkHTML(tech) {
    var m = fabricMeta(tech);
    var label = m ? m.label : (tech || 'Fabric');
    return '<a class="pdp__fabric" href="' + fabricHref(tech) + '">' + esc(label) + '</a>';
  }
  function parasHTML(text) {
    return String(text || '').split(/\n\n+/).map(function (block) {
      var t = block.trim();
      return t ? '<p>' + esc(t) + '</p>' : '';
    }).join('');
  }
  function bulletsHTML(items) {
    if (!items || !items.length) return '';
    return '<ul>' + items.map(function (item) { return '<li>' + esc(item) + '</li>'; }).join('') + '</ul>';
  }
  function pdpDetailsHTML(p) {
    var copy = p.pdp || {};
    var m = fabricMeta(p.fabricTech);
    var html = parasHTML(copy.detailsLead || p.fabric);
    if (m) {
      html += '<p>' + fabricLinkHTML(p.fabricTech) + ' — ' + esc(m.blurb) +
        ' <a href="' + fabricHref(p.fabricTech) + '">Learn more →</a></p>' +
        '<p>Care: ' + esc(m.care.replace(/^Care:\s*/i, '')) + '</p>';
    }
    if (copy.namedAfter) html += parasHTML(copy.namedAfter);
    return html;
  }
  function pdpAccordion(p, openIndex) {
    var copy = p.pdp || {};
    var why = copy.why && copy.why.length ? bulletsHTML(copy.why) : parasHTML(p.blurb);
    var fit = parasHTML(copy.fit || 'Designed for a relaxed, coverage-first fit. Choose your usual Kalsoni size.');
    if (copy.fit && /size guide/i.test(copy.fit)) {
      fit += '<p><button class="link-underline" type="button" data-open-sizeguide>View size guide</button></p>';
    }
    var items = [
      { title: 'WHY YOU\'LL LOVE IT', html: why },
      { title: 'FIT & SIZING', html: fit },
      { title: 'DETAILS & CARE', html: pdpDetailsHTML(p) },
      { title: 'SHIPPING & RETURNS', html: '<p>' + esc(K.pdpShipping) + '</p>' }
    ];
    return items.map(function (a, i) {
      var open = openIndex === i;
      return '<div class="acc' + (open ? ' is-open' : '') + '"><button class="acc__btn" type="button" data-acc="' + i + '">' + a.title + '<span>' + (open ? '−' : '+') + '</span></button>' +
        (open ? '<div class="acc__body">' + a.html + '</div>' : '') + '</div>';
    }).join('');
  }

  function renderProduct() {
    var root = $('#pdp');
    if (!root) return;
    var p = K.getProduct(qparam('id') || 'adna-mid-tunic');
    document.title = p.name + ' — Kalsoni';
    var isBundle = !!p.bundle;
    var lookItems = K.getMany(p.completeLook);
    var bundleItems = isBundle ? K.getMany(p.includes) : [];
    var startColor = 0;
    var colorParam = qparam('color');
    if (colorParam) {
      for (var i = 0; i < p.colors.length; i++) {
        if (p.colors[i].name.toLowerCase() === colorParam.toLowerCase()) { startColor = i; break; }
      }
    }
    var copy = p.pdp || {};
    var state = { color: startColor, size: null, thumb: 0, qty: 1, acc: 0, option: 0, set: { on: {}, size: {} } };

    // "Pairs well with — build your set" (mockup): main piece + optional add-ons.
    function setDefaultSize(x) {
      return state.set.size[x.id] || (x.sizes.indexOf('M') > -1 ? 'M' : x.sizes[0]);
    }
    function setBuilderHTML(gallery) {
      if (isBundle || !lookItems.length) return '';
      var firstName = p.name.split(' ')[0];
      var total = p.price;
      var rows = lookItems.map(function (x) {
        var on = !!state.set.on[x.id];
        if (on) total += x.price;
        var isHead = x.category === 'hijabs-shawls';
        var group = x.category === 'bottoms' ? 'ADD A BOTTOM' : (isHead ? 'ADD PERFORMANCE HEADWEAR' : 'ADD TO YOUR SET');
        var right = isHead
          ? '<span class="setrow__fixed">' + esc(x.colors[0].name) + '</span>'
          : '<select class="setrow__select" data-set-size="' + x.id + '" aria-label="Size">' + x.sizes.map(function (s) {
              return '<option value="' + s + '"' + (s === setDefaultSize(x) ? ' selected' : '') + '>' + s + '</option>';
            }).join('') + '</select>';
        return '<div class="setrow__group">' + group + '</div>' +
          '<div class="setrow' + (on ? ' is-on' : '') + '">' +
          '<input type="checkbox" data-set-toggle="' + x.id + '"' + (on ? ' checked' : '') + ' aria-label="Add ' + esc(x.name) + '">' +
          '<img src="' + x.img + '" alt="' + esc(x.name) + '">' +
          '<div class="setrow__info"><div class="setrow__name">' + esc(x.name) + '</div><div class="setrow__meta">+ ' + money(x.price) + '</div></div>' +
          right +
          '</div>';
      }).join('');
      var remaining = Math.max(0, 125 - total);
      var shipLine = remaining > 0
        ? "You're " + money(remaining) + ' away from free U.S. shipping.'
        : 'Your set qualifies for free U.S. shipping.';
      return '<section class="pdp-set">' +
        '<div class="pdp-set__head"><span class="eyebrow">PAIRS WELL WITH</span><h2>Build your ' + esc(firstName) + ' set</h2>' +
        '<p class="pdp-set__sub">Choose the pieces and independent sizes that fit the way you move.</p></div>' +
        '<div class="setrow setrow--main">' +
        '<img src="' + gallery[0].img + '" alt="' + esc(p.name) + '">' +
        '<div class="setrow__info"><div class="setrow__name">' + esc(p.name) + '</div><div class="setrow__meta">Your selected color and size</div></div>' +
        '<span class="setrow__fixed">Included</span></div>' +
        rows +
        '<div class="pdp-set__foot">' +
        '<div class="pdp-set__total"><span>Selected set</span><span>' + money(total) + '</span></div>' +
        '<button class="btn btn--solid btn--full" data-add-set>ADD SELECTED SET TO BAG</button>' +
        '<div class="pdp-set__ship">' + shipLine + '</div>' +
        '</div></section>';
    }

    var valuesHTML = '<section class="pdp-values">' +
      '<div><h3>CERTIFIED B CORPORATION</h3><p>Purpose, community and accountability independently recognized.</p></div>' +
      '<div><h3>AVAILABLE AT SELECT REI STORES</h3><p>Making modest performance apparel more accessible in Minnesota.</p></div>' +
      '<div><h3>DESIGNED FROM LIVED EXPERIENCE</h3><p>Created to remove clothing barriers from sport and everyday movement.</p></div>' +
      '</section>';

    function motionHTML(gallery) {
      var labels = ['COVERAGE THROUGH EVERY REP', 'DESIGNED TO STAY WITH YOU', 'STYLE THE COMPLETE SET'];
      var stills = gallery.slice(1, 4);
      while (stills.length < 3) stills.push(gallery[0]);
      var tiles = '<div class="motion-tile"><video autoplay muted loop playsinline src="assets/kalsoni-video.mp4"></video><span>SEE HOW IT MOVES</span></div>' +
        stills.map(function (g, i) {
          return '<div class="motion-tile"><img src="' + g.img + '" alt="" loading="lazy"><span>' + labels[i] + '</span></div>';
        }).join('');
      return '<div class="pdp-strip"><span>COVERAGE BY DESIGN</span><span>FOUR-WAY STRETCH</span><span>SIZES XS&ndash;5XL</span><span>CERTIFIED B CORPORATION</span></div>' +
        '<section class="pdp-motion">' +
        '<div class="pdp-motion__head">' +
        '<div><span class="eyebrow">KALSONI IN MOTION</span><h2>See how it moves.</h2></div>' +
        '<p class="pdp-motion__sub">Real coverage is best understood in motion. See Kalsoni activewear on women training, walking, stretching, and moving through their everyday routines.</p>' +
        '</div>' +
        '<div class="pdp-motion__grid">' + tiles + '</div>' +
        '<div class="pdp-motion__foot"><span>Real routines and real movement from the Kalsoni community.</span><a class="link-underline" href="https://www.instagram.com/kalsoniapparel/">FOLLOW @KALSONIAPPAREL</a></div>' +
        '</section>';
    }

    var reviewsHTML = '<section class="pdp-reviews">' +
      '<div class="pdp-reviews__head"><span class="eyebrow">CUSTOMER REVIEWS</span><h2>Worn, moved in, and reviewed by you.</h2></div>' +
      '<div class="pdp-reviews__body">' +
      '<div class="stars pdp-reviews__stars">&#9734; &#9734; &#9734; &#9734; &#9734;</div>' +
      '<p class="pdp-reviews__lead">Customer feedback belongs here.</p>' +
      '<p class="pdp-reviews__note">Connect the SHOPLINE reviews feed to display verified ratings, fit feedback, photos, and written reviews.</p>' +
      '<div class="pdp-reviews__actions">' +
      '<button class="btn btn--solid" type="button" data-review-cta>WRITE A REVIEW</button>' +
      '<button class="btn btn--outline" type="button" data-review-cta>ASK A FIT QUESTION</button>' +
      '</div></div></section>';

    var whyHTML = '<section class="pdp-why"><span class="eyebrow">WHY KALSONI</span><h2>Made with more in mind.</h2>' +
      '<p>Coverage-first activewear informed by the women who move in it &mdash; thoughtfully created so more women can participate as themselves.</p></section>';

    function draw() {
      // per-colour gallery: swatch selection swaps the whole 5-shot set
      var gallery = (p.colorGalleries && p.colorGalleries[state.color]) || p.gallery || [{ label: 'Front', img: p.img }];
      if (state.thumb >= gallery.length) state.thumb = 0;
      var thumbs = gallery.map(function (g, i) {
        return '<button class="pdp-thumb' + (i === state.thumb ? ' is-active' : '') + '" data-thumb="' + i + '" title="' + g.label + '"><img src="' + g.img + '" alt="' + g.label + '"></button>';
      }).join('');
      var colors = p.colors.map(function (c, i) {
        return '<button class="swatch' + (i === state.color ? ' is-active' : '') + '" data-color="' + i + '" style="background:' + c.hex + '" aria-label="' + c.name + '"></button>';
      }).join('');
      var sizes = p.sizes.map(function (label) {
        var soldOut = label === p.soldOut;
        var active = label === state.size;
        return '<button class="sizebtn' + (soldOut ? ' is-sold' : '') + (active ? ' is-active' : '') + '" data-size="' + label + '"' + (soldOut ? ' disabled' : '') + '>' + label + '</button>';
      }).join('');
      var accordion = pdpAccordion(p, state.acc);

      var opt = isBundle && p.bundleOptions ? p.bundleOptions[state.option] : null;
      var livePrice = opt ? opt.price : p.price;
      var liveCompare = opt ? opt.compareAt : p.compareAt;

      var optionBtns = (p.bundleOptions || []).map(function (o, i) {
        return '<button class="bundle-opt' + (i === state.option ? ' is-active' : '') + '" type="button" data-bopt="' + i + '">' +
          '<span>' + esc(o.label) + '</span>' +
          '<span>' + money(o.price) + (o.compareAt ? ' <s>' + money(o.compareAt) + '</s>' : '') + '</span>' +
          '</button>';
      }).join('');

      // bundles show options + what's included; standard products show a size grid.
      var selectorBlock = isBundle
        ? (optionBtns ? '<div class="pdp__label">BUNDLE OPTION</div><div class="pdp__bopts">' + optionBtns + '</div>' : '') +
        '<div class="pdp__label">WHAT\'S INCLUDED</div>' +
        '<div class="pdp__includes">' + bundleItems.map(function (x) {
          return '<a class="incl" href="product.html?id=' + x.id + '"><img src="' + x.img + '" alt="' + esc(x.name) + '">' +
            '<div><div class="incl__name">' + esc(x.name) + '</div><div class="incl__cat">' + x.categoryLabel + '</div></div></a>';
        }).join('') + '</div>' +
        '<div class="pdp__bundlenote">' + esc(p.bundleNote || 'Select colours and sizes for each piece after adding to cart.') + '</div>'
        : '<div class="pdp__label pdp__label--row"><span>SIZE</span><button class="link-underline" data-open-sizeguide>SIZE GUIDE</button></div>' +
        '<div class="pdp__sizes">' + sizes + '</div>';

      var colorBlock = isBundle
        ? ''
        : '<div class="pdp__label">COLOR — <span>' + p.colors[state.color].name + '</span></div><div class="pdp__swatches">' + colors + '</div>';

      var priceHtml = money(livePrice) + (liveCompare ? ' <s class="pdp__was">' + money(liveCompare) + '</s>' : '');
      var crumbCat = isBundle
        ? '<a href="bundles.html">BUNDLES</a>'
        : p.categoryLabel;

      var desc = copy.description || p.blurb;
      var features = isBundle ? [] : (copy.features || []);
      var descHTML = '<div class="pdp__desc">' + parasHTML(desc) + '</div>';
      var featuresHTML = features.length
        ? '<div class="pdp__label">FEATURES</div><ul class="pdp__features">' + features.map(function (f) {
          return '<li>' + esc(f) + '</li>';
        }).join('') + '</ul>'
        : '';
      var fabricLine = p.fabricTech
        ? '<div class="pdp__fabricline">' + fabricLinkHTML(p.fabricTech) + '</div>'
        : '';

      var badge = p.badge ? '<div class="pdp__badge">' + esc(p.badge) + '</div>' : '';
      var chips = isBundle ? '' : '<div class="pdp__chips">' +
        ['COVERAGE THAT MOVES', 'LIGHTWEIGHT ' + String(p.fabricTech || 'PERFORMANCE').toUpperCase() + ' PERFORMANCE', 'DISTRACTION-FREE DESIGN'].map(function (c) {
          return '<span class="pdp__chip">' + c + '</span>';
        }).join('') + '</div>';
      var buyLabel = (!isBundle && !state.size) ? 'SELECT A SIZE' : 'ADD TO CART — ' + money(livePrice);

      root.innerHTML =
        '<div class="crumbs"><a href="index.html">HOME</a> &nbsp;/&nbsp; ' + crumbCat + ' &nbsp;/&nbsp; <span>' + esc(p.name) + '</span></div>' +
        '<div class="pdp' + (isBundle ? ' pdp--bundle' : '') + '">' +
        '<div class="pdp__gallery"><div class="pdp__thumbs">' + thumbs + '</div>' +
        '<div class="pdp__main"><img src="' + gallery[state.thumb].img + '" alt="' + esc(p.name) + '"><span class="pdp__shotlabel">' + gallery[state.thumb].label + '</span></div></div>' +
        '<div class="pdp__info">' +
        '<div class="pdp__cat">' + p.categoryLabel + '</div>' +
        badge +
        '<h1>' + esc(p.name) + '</h1>' +
        fabricLine +
        '<div class="pdp__rating"><span class="pdp__price">' + priceHtml + '</span><span class="vline"></span>' +
        '<span class="stars">' + STARS + '</span><span class="pdp__reviews">' + p.rating.toFixed(1) + ' (' + p.reviewCount + ')</span></div>' +
        descHTML +
        featuresHTML +
        colorBlock +
        selectorBlock +
        chips +
        '<div class="pdp__buy"><div class="qty"><button data-qty="-1">−</button><span>' + state.qty + '</span><button data-qty="1">+</button></div>' +
        '<button class="btn btn--solid pdp__add">' + buyLabel + '</button></div>' +
        '<div class="pdp__assures">' +
        '<div><div class="pdp__assure-title">Free shipping $125+</div><div class="pdp__assure-sub">On U.S. orders</div></div>' +
        '<div><div class="pdp__assure-title">Need fit help?</div><div class="pdp__assure-sub"><button class="link-underline" type="button" data-open-sizeguide>View the size guide</button></div></div>' +
        '</div>' +
        setBuilderHTML(gallery) +
        '<div class="pdp__acc">' + accordion + '</div>' +
        '</div>' +
        '</div>' +
        valuesHTML +
        motionHTML(gallery) +
        reviewsHTML +
        whyHTML;
    }

    root.addEventListener('click', function (e) {
      var t = e.target;
      var b;
      if (t.closest('[data-add]')) return; // handled by global quick-add
      if ((b = t.closest('[data-thumb]'))) { state.thumb = +b.dataset.thumb; draw(); }
      else if ((b = t.closest('[data-bopt]'))) { state.option = +b.dataset.bopt; draw(); }
      else if ((b = t.closest('[data-color]'))) { state.color = +b.dataset.color; state.thumb = 0; draw(); }
      else if ((b = t.closest('[data-size]')) && !b.disabled) { state.size = b.dataset.size; draw(); }
      else if ((b = t.closest('[data-acc]'))) { state.acc = (state.acc === +b.dataset.acc ? -1 : +b.dataset.acc); draw(); }
      else if ((b = t.closest('[data-qty]'))) { state.qty = Math.max(1, state.qty + (+b.dataset.qty)); draw(); }
      else if (t.closest('[data-review-cta]')) { toast('CONNECT SHOPLINE REVIEWS TO ENABLE'); }
      else if (t.closest('[data-add-set]')) {
        if (!state.size) { toast('PLEASE SELECT A SIZE FIRST'); return; }
        addLine(p, state.color, state.size, 1, false);
        lookItems.forEach(function (x) {
          if (!state.set.on[x.id]) return;
          var sz = x.category === 'hijabs-shawls' ? 'One Size' : setDefaultSize(x);
          addLine(x, 0, sz, 1, false);
        });
        toast('SET ADDED TO CART');
        openCart();
      }
      else if (t.closest('.pdp__add')) {
        if (!isBundle && !state.size) { toast('PLEASE SELECT A SIZE'); return; }
        var addOpt = isBundle && p.bundleOptions ? p.bundleOptions[state.option] : null;
        addLine(p, state.color, addOpt ? addOpt.label : (isBundle ? 'Set' : state.size), state.qty, true, addOpt ? addOpt.price : undefined);
        toast('ADDED TO CART');
      }
    });
    root.addEventListener('change', function (e) {
      var el = e.target;
      if (el.matches('[data-set-toggle]')) { state.set.on[el.dataset.setToggle] = el.checked; draw(); }
      else if (el.matches('[data-set-size]')) { state.set.size[el.dataset.setSize] = el.value; draw(); }
    });
    draw();
  }

  function renderCheckout() {
    var root = $('#checkout');
    if (!root) return;
    var cart = getCart();
    var sub = subtotal();
    var shipping = (sub >= 125 || sub === 0) ? 0 : 6.95;
    var total = sub + shipping;
    var shipLabel = shipping === 0 ? 'FREE' : money(shipping);

    var summaryItems = cart.length === 0
      ? '<p class="summary__empty">Your cart is empty. <a href="shop.html">Shop now</a></p>'
      : cart.map(function (it) {
        return '<div class="summary__line"><div class="summary__media"><img src="' + it.img + '" alt="' + esc(it.name) + '"><span>' + it.qty + '</span></div>' +
          '<div class="summary__info"><div>' + esc(it.name) + '</div><div class="summary__meta">' + esc(it.colorName) + ' / ' + esc(it.size) + '</div></div>' +
          '<div>' + money(it.price * it.qty) + '</div></div>';
      }).join('');

    $('#summary-items').innerHTML = summaryItems;
    $('#summary-sub').textContent = money(sub);
    $('#summary-ship').textContent = shipLabel;
    $('#summary-total').textContent = money(total);
    $('#summary-ship-pill').textContent = shipLabel;
    $all('.totallabel').forEach(function (el) { el.textContent = money(total); });

    var form = $('#checkout-form');
    if (form) form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (getCart().length === 0) { window.location.href = 'shop.html'; return; }
      var num = 'KSN-' + Math.floor(100000 + Math.random() * 900000);
      saveCart([]);
      $('#summary-total-confirm') && ($('#summary-total-confirm').textContent = money(total));
      var conf = $('#confirmation');
      $('#checkout-grid').hidden = true;
      $('#checkout-head').hidden = true;
      $('#conf-number').textContent = num;
      $('#conf-total').textContent = money(total);
      conf.hidden = false;
      window.scrollTo(0, 0);
    });
  }

  function renderForms() {
    $all('[data-toast-form]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        toast(form.getAttribute('data-toast-form'));
        form.reset();
      });
    });
  }

  /* ============================================================
     BOOT
     ============================================================ */
  function injectChrome() {
    var page = document.body.getAttribute('data-page') || '';
    document.body.insertAdjacentHTML('afterbegin', marqueeHTML() + headerHTML(page));
    document.body.insertAdjacentHTML('beforeend', footerHTML() + overlaysHTML());
  }

  function wireGlobalEvents() {
    document.addEventListener('click', function (e) {
      var t = e.target;
      if (t.closest('[data-open-cart]')) { e.preventDefault(); openCart(); }
      else if (t.closest('[data-close-cart]')) { closeOverlay('[data-cart]'); }
      else if (t.closest('[data-open-nav]')) { e.preventDefault(); openNav(); }
      else if (t.closest('[data-close-nav]')) { e.preventDefault(); closeNav(); }
      else if (t.closest('[data-open-search]')) { e.preventDefault(); openSearch(); }
      else if (t.closest('[data-close-search]')) { closeOverlay('[data-search]'); }
      else if (t.closest('[data-open-sizeguide]')) { e.preventDefault(); openOverlay('[data-sizeguide]'); }
      else if (t.closest('[data-close-sizeguide]')) { closeOverlay('[data-sizeguide]'); }
      else if (t.closest('[data-close-welcome]')) { e.preventDefault(); closeWelcome(); }
      else if (t.closest('[data-welcome-chip]')) { e.preventDefault(); t.closest('[data-welcome-chip]').classList.toggle('is-selected'); }
      else if (t.closest('[data-add]')) { e.preventDefault(); var addBtn = t.closest('[data-add]'); quickAdd(addBtn.dataset.add, addBtn.dataset.color); }
      else if (t.closest('[data-inc]')) { changeQty(+t.closest('[data-inc]').dataset.inc, 1); }
      else if (t.closest('[data-dec]')) { changeQty(+t.closest('[data-dec]').dataset.dec, -1); }
      else if (t.closest('[data-remove]')) { removeItem(+t.closest('[data-remove]').dataset.remove); }
    });
    document.addEventListener('input', function (e) {
      if (e.target.matches('[data-search-input]')) renderSearch(e.target.value);
    });
    document.addEventListener('submit', function (e) {
      if (e.target.matches('[data-welcome-form]')) { e.preventDefault(); toast('WELCOME — 10% OFF UNLOCKED'); closeWelcome(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        ['[data-cart]', '[data-search]', '[data-sizeguide]', '[data-welcome]', '[data-nav]'].forEach(function (s) {
          var o = $(s); if (o && !o.hidden) { if (s === '[data-nav]') closeNav(); else closeOverlay(s); }
        });
      }
    });
  }

  function boot() {
    injectChrome();
    wireGlobalEvents();
    refreshChrome();
    var page = document.body.getAttribute('data-page');
    if (page === 'home') renderHome();
    else if (page === 'shop') renderShop();
    else if (page === 'bundles') renderBundles();
    else if (page === 'stores') renderStores();
    else if (page === 'collections') renderCollections();
    else if (page === 'lookbook') renderLookbook();
    else if (page === 'journal') renderJournal();
    else if (page === 'journal-post') renderJournalPost();
    else if (page === 'fabric') renderFabric();
    else if (page === 'product') renderProduct();
    else if (page === 'checkout') renderCheckout();
    renderForms();
    maybeShowWelcome();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
