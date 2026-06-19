/* ============================================================
   KALSONI — shared front-end app
   Header/footer/overlay injection, cart (localStorage),
   search, size guide, and per-page rendering.
   ============================================================ */
(function () {
  var K = window.KALSONI;
  var money = K.money;
  var CART_KEY = 'kalsoni-cart-v1';

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
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {}
    refreshChrome();
  }
  function cartCount() { return getCart().reduce(function (n, it) { return n + it.qty; }, 0); }
  function subtotal() { return getCart().reduce(function (n, it) { return n + it.price * it.qty; }, 0); }

  function addLine(p, colorIdx, size, qty, openDrawer) {
    var c = p.colors[colorIdx] || p.colors[0];
    var cart = getCart();
    var found = cart.filter(function (x) { return x.id === p.id && x.colorName === c.name && x.size === size; })[0];
    if (found) found.qty += qty;
    else cart.push({ id: p.id, name: p.name, price: p.price, colorName: c.name, colorHex: c.hex, size: size, qty: qty, img: p.img });
    saveCart(cart);
    if (openDrawer) openCart();
  }
  function quickAdd(id) {
    var p = K.getProduct(id);
    var size = p.sizes.filter(function (s) { return s !== p.soldOut; })[0] || p.sizes[0];
    addLine(p, 0, size, 1, true);
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
    var msg = '<span>FREE SHIPPING OVER $75</span><span class="marquee__dot">&bull;</span>' +
      '<span>MODEST ACTIVEWEAR &mdash; MADE BY &amp; FOR WOMEN</span><span class="marquee__dot">&bull;</span>' +
      '<span>PERFORMANCE FABRIC, BUILT TO MOVE</span><span class="marquee__dot">&bull;</span>';
    return '<div class="marquee"><div class="marquee__track">' + msg + msg + '</div></div>';
  }

  function headerHTML(active) {
    function nav(href, label, key) {
      return '<a href="' + href + '"' + (active === key ? ' class="is-active"' : '') + '>' + label + '</a>';
    }
    return '<header class="header"><div class="header__inner">' +
      '<nav class="header__nav">' +
        nav('shop.html', 'SHOP', 'shop') +
        nav('collections.html', 'COLLECTIONS', 'collections') +
        nav('wholesale.html', 'WHOLESALE', 'wholesale') +
      '</nav>' +
      '<a href="index.html" class="header__logo">KALSONI</a>' +
      '<div class="header__actions">' +
        '<button class="iconbtn" data-open-search aria-label="Search"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.5" y2="16.5"></line></svg></button>' +
        '<a class="iconbtn" href="contact.html" aria-label="Account"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="12" cy="8" r="4"></circle><path d="M5 21c0-4 3.5-6 7-6s7 2 7 6"></path></svg></a>' +
        '<button class="iconbtn" data-open-cart aria-label="Cart"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M6.5 8h11l-1 12.5h-9L6.5 8z"></path><path d="M9 8a3 3 0 0 1 6 0"></path></svg><span class="count" data-cart-count></span></button>' +
      '</div>' +
      '</div></header>';
  }

  function footerHTML() {
    return '<footer class="footer"><div class="footer__inner"><div class="footer__cols">' +
      '<div><div class="footer__brand">KALSONI</div>' +
        '<p class="footer__about">Modest activewear &amp; athleisure designed to move freely, comfortably, and with confidence.</p>' +
        '<div class="footer__social"><a href="https://www.instagram.com/kalsoniapparel/">INSTAGRAM</a><a href="https://www.facebook.com/kalsoniapparel/">FACEBOOK</a><a href="https://www.linkedin.com/company/kalsoni/">LINKEDIN</a></div></div>' +
      '<div><div class="footer__heading">HELP</div><div class="footer__links">' +
        '<button data-open-sizeguide type="button">Size Guide</button><a href="contact.html">FAQ</a><a href="contact.html">Contact Us</a><a href="shop.html">Our Fabric</a><a href="collections.html">Collections</a></div></div>' +
      '<div><div class="footer__heading">ABOUT</div><div class="footer__links">' +
        '<a href="index.html#about">Who We Are</a><a href="wholesale.html">Wholesale</a><a href="contact.html">Send Feedback</a><a href="shop.html">Shop All</a></div></div>' +
      '<div><div class="footer__heading">FLAGSHIP STORES</div><div class="footer__stores">REI Bloomington<br><span>750 American Blvd W, MN 55420</span><br><br>REI Roseville<br><span>1955 County Road B2 W, MN 55113</span></div></div>' +
      '</div><div class="footer__bottom"><span>&copy; 2026 KALSONI. ALL RIGHTS RESERVED.</span>' +
      '<span class="legal"><a href="#">PRIVACY POLICY</a><a href="#">TERMS OF SERVICE</a></span></div></div></footer>';
  }

  function overlaysHTML() {
    return (
      // search
      '<div class="overlay" data-search hidden>' +
        '<div class="overlay__scrim" data-close-search></div>' +
        '<div class="search-panel"><div class="search-panel__inner">' +
          '<div class="search-panel__bar">' +
            '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.5" y2="16.5"></line></svg>' +
            '<input type="text" name="q" data-search-input placeholder="Search activewear, hijabs, jackets…">' +
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
      // toast
      '<div class="toast" data-toast hidden></div>'
    );
  }

  /* ---------- product card ---------- */
  function cardHTML(p) {
    var dots = p.colors.map(function (c) { return '<span class="dot" style="background:' + c.hex + ';"></span>'; }).join('');
    return '<article class="card">' +
      '<a class="card__media" href="product.html?id=' + p.id + '">' +
        '<img src="' + p.img + '" alt="' + esc(p.name) + '" loading="lazy">' +
        (p.isNew ? '<span class="card__badge">NEW</span>' : '') +
        '<button class="card__add" type="button" data-add="' + p.id + '" aria-label="Quick add">+</button>' +
      '</a>' +
      '<a class="card__meta" href="product.html?id=' + p.id + '">' +
        '<div><div class="card__cat">' + p.categoryLabel + '</div><div class="card__name">' + esc(p.name) + '</div></div>' +
        '<div class="card__price">' + money(p.price) + '</div>' +
      '</a>' +
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
    var remaining = Math.max(0, 75 - sub);
    var pct = Math.min(100, sub / 75 * 100);
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

  /* ---------- search ---------- */
  function renderSearch(q) {
    var box = $('[data-search-results]');
    if (!box) return;
    q = (q || '').trim().toLowerCase();
    if (!q) { box.innerHTML = ''; return; }
    var hits = K.products.filter(function (p) { return (p.name + ' ' + p.categoryLabel).toLowerCase().indexOf(q) > -1; });
    if (hits.length === 0) {
      box.innerHTML = '<div class="search-empty">No results for "' + esc(q) + '". Try "hijab", "jacket" or "top".</div>';
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
  function renderHome() {
    var grid = $('#featured-grid');
    if (grid) grid.innerHTML = K.products.slice(0, 4).map(cardHTML).join('');
    var cats = $('#home-cats');
    if (cats) {
      var trio = [
        { label: 'Sport Hijabs', cat: 'hijabs', img: K.IMG.blue },
        { label: 'Tops', cat: 'tops', img: K.IMG.top1 },
        { label: 'Jackets', cat: 'jackets', img: K.IMG.jacket }
      ];
      cats.innerHTML = trio.map(function (c) {
        return '<a class="cat" href="shop.html?cat=' + c.cat + '"><img src="' + c.img + '" alt="' + c.label + '" loading="lazy">' +
          '<div class="cat__shade"></div><div class="cat__label"><div class="name">' + c.label + '</div><div class="shop">SHOP NOW &rarr;</div></div></a>';
      }).join('');
    }
  }

  function renderShop() {
    var grid = $('#shop-grid');
    if (!grid) return;
    var state = { filter: qparam('cat') || 'all', sort: 'featured' };
    var filters = [['All', 'all'], ['Sport Hijabs', 'hijabs'], ['Tops', 'tops'], ['Jackets', 'jackets'], ['Leggings', 'leggings'], ['Sets', 'sets']];
    var pillWrap = $('#shop-pills');
    var sortSel = $('#shop-sort');
    var resultEl = $('#shop-result');

    function draw() {
      var list = K.products.filter(function (p) { return state.filter === 'all' || p.category === state.filter; }).slice();
      if (state.sort === 'price-asc') list.sort(function (a, b) { return a.price - b.price; });
      else if (state.sort === 'price-desc') list.sort(function (a, b) { return b.price - a.price; });
      else if (state.sort === 'newest') list.sort(function (a, b) { return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0); });
      grid.innerHTML = list.map(cardHTML).join('');
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

  function renderCollections() {
    var grid = $('#collections-grid');
    if (!grid) return;
    grid.innerHTML = K.collections.map(function (col) {
      var items = K.products.filter(function (p) { return p.category === col.cat; });
      var img = (items[0] || K.products[0]).img;
      var count = items.length + (items.length === 1 ? ' style' : ' styles');
      return '<a class="collection" href="shop.html?cat=' + col.cat + '">' +
        '<div class="collection__media"><img src="' + img + '" alt="' + col.label + '" loading="lazy"><span class="collection__count">' + count + '</span></div>' +
        '<div class="collection__row"><div><h2>' + col.label + '</h2><p>' + col.blurb + '</p></div>' +
        '<span class="collection__shop">SHOP &rarr;</span></div></a>';
    }).join('');
  }

  function renderProduct() {
    var root = $('#pdp');
    if (!root) return;
    var p = K.getProduct(qparam('id') || 'sport-hijab');
    document.title = p.name + ' — Kalsoni';
    var others = K.products.filter(function (x) { return x.id !== p.id; });
    var gallery = [p.img].concat(others.slice(0, 2).map(function (x) { return x.img; }));
    var state = { color: 0, size: null, thumb: 0, qty: 1, acc: 0 };
    var accItems = [
      { title: 'DETAILS & FIT', body: p.blurb + ' Designed for a modest, relaxed fit — true to size with full coverage.' },
      { title: 'FABRIC & CARE', body: p.fabric + ' Machine wash cold, hang to dry. Do not bleach or iron print.' },
      { title: 'SHIPPING & RETURNS', body: 'Free standard shipping on orders over $75. 30-day easy returns on unworn items with tags attached.' }
    ];
    var sameCat = others.filter(function (x) { return x.category === p.category; });
    var related = sameCat.concat(others.filter(function (x) { return x.category !== p.category; })).slice(0, 4);

    function draw() {
      var thumbs = gallery.map(function (img, i) {
        return '<button class="pdp-thumb' + (i === state.thumb ? ' is-active' : '') + '" data-thumb="' + i + '"><img src="' + img + '" alt="View"></button>';
      }).join('');
      var colors = p.colors.map(function (c, i) {
        return '<button class="swatch' + (i === state.color ? ' is-active' : '') + '" data-color="' + i + '" style="background:' + c.hex + '" aria-label="' + c.name + '"></button>';
      }).join('');
      var sizes = p.sizes.map(function (label) {
        var soldOut = label === p.soldOut;
        var active = label === state.size;
        return '<button class="sizebtn' + (soldOut ? ' is-sold' : '') + (active ? ' is-active' : '') + '" data-size="' + label + '"' + (soldOut ? ' disabled' : '') + '>' + label + '</button>';
      }).join('');
      var accordion = accItems.map(function (a, i) {
        var open = state.acc === i;
        return '<div class="acc' + (open ? ' is-open' : '') + '"><button class="acc__btn" data-acc="' + i + '">' + a.title + '<span>' + (open ? '−' : '+') + '</span></button>' +
          (open ? '<p class="acc__body">' + a.body + '</p>' : '') + '</div>';
      }).join('');

      root.innerHTML =
        '<div class="crumbs"><a href="shop.html">SHOP</a> &nbsp;/&nbsp; ' + p.categoryLabel + ' &nbsp;/&nbsp; <span>' + esc(p.name) + '</span></div>' +
        '<div class="pdp">' +
          '<div class="pdp__gallery"><div class="pdp__thumbs">' + thumbs + '</div>' +
            '<div class="pdp__main"><img src="' + gallery[state.thumb] + '" alt="' + esc(p.name) + '"></div></div>' +
          '<div class="pdp__info">' +
            '<div class="pdp__cat">' + p.categoryLabel + '</div>' +
            '<h1>' + esc(p.name) + '</h1>' +
            '<div class="pdp__rating"><span class="pdp__price">' + money(p.price) + '</span><span class="vline"></span>' +
              '<span class="stars">' + STARS + '</span><span class="pdp__reviews">' + p.rating.toFixed(1) + ' (' + p.reviewCount + ')</span></div>' +
            '<p class="pdp__blurb">' + esc(p.blurb) + '</p>' +
            '<div class="pdp__label">COLOR — <span>' + p.colors[state.color].name + '</span></div>' +
            '<div class="pdp__swatches">' + colors + '</div>' +
            '<div class="pdp__label pdp__label--row"><span>SIZE</span><button class="link-underline" data-open-sizeguide>SIZE GUIDE</button></div>' +
            '<div class="pdp__sizes">' + sizes + '</div>' +
            '<div class="pdp__buy"><div class="qty"><button data-qty="-1">−</button><span>' + state.qty + '</span><button data-qty="1">+</button></div>' +
              '<button class="btn btn--solid pdp__add">ADD TO CART — ' + money(p.price) + '</button></div>' +
            '<div class="pdp__assure">✓ Free shipping over $75 &nbsp;·&nbsp; 30-day easy returns</div>' +
            '<div class="pdp__acc">' + accordion + '</div>' +
          '</div>' +
        '</div>' +
        '<section class="pdp-reviews"><div class="pdp-reviews__head"><h2>Reviews</h2><div class="stars">' + STARS + '</div>' +
          '<div class="pdp-reviews__sub">' + p.rating.toFixed(1) + ' out of 5 · ' + p.reviewCount + ' reviews</div></div>' +
          '<div class="pdp-reviews__list">' + K.reviews.map(function (r) {
            return '<div class="review"><div class="review__top"><span class="stars">' + STARS + '</span><span class="review__date">' + r.date + '</span></div>' +
              '<div class="review__title">' + esc(r.title) + '</div><p>' + esc(r.body) + '</p><div class="review__name">' + esc(r.name) + ' · VERIFIED BUYER</div></div>';
          }).join('') + '</div></section>' +
        '<section class="pdp-related"><h2>You may also like</h2><div class="product-grid">' + related.map(cardHTML).join('') + '</div></section>';
    }

    root.addEventListener('click', function (e) {
      var t = e.target;
      var b;
      if ((b = t.closest('[data-thumb]'))) { state.thumb = +b.dataset.thumb; draw(); }
      else if ((b = t.closest('[data-color]'))) { state.color = +b.dataset.color; draw(); }
      else if ((b = t.closest('[data-size]')) && !b.disabled) { state.size = b.dataset.size; draw(); }
      else if ((b = t.closest('[data-acc]'))) { state.acc = (state.acc === +b.dataset.acc ? -1 : +b.dataset.acc); draw(); }
      else if ((b = t.closest('[data-qty]'))) { state.qty = Math.max(1, state.qty + (+b.dataset.qty)); draw(); }
      else if (t.closest('.pdp__add')) {
        if (!state.size) { toast('PLEASE SELECT A SIZE'); return; }
        addLine(p, state.color, state.size, state.qty, true);
        toast('ADDED TO CART');
      }
    });
    draw();
  }

  function renderCheckout() {
    var root = $('#checkout');
    if (!root) return;
    var cart = getCart();
    var sub = subtotal();
    var shipping = (sub >= 75 || sub === 0) ? 0 : 6.95;
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
      else if (t.closest('[data-open-search]')) { e.preventDefault(); openSearch(); }
      else if (t.closest('[data-close-search]')) { closeOverlay('[data-search]'); }
      else if (t.closest('[data-open-sizeguide]')) { e.preventDefault(); openOverlay('[data-sizeguide]'); }
      else if (t.closest('[data-close-sizeguide]')) { closeOverlay('[data-sizeguide]'); }
      else if (t.closest('[data-add]')) { e.preventDefault(); quickAdd(t.closest('[data-add]').dataset.add); }
      else if (t.closest('[data-inc]')) { changeQty(+t.closest('[data-inc]').dataset.inc, 1); }
      else if (t.closest('[data-dec]')) { changeQty(+t.closest('[data-dec]').dataset.dec, -1); }
      else if (t.closest('[data-remove]')) { removeItem(+t.closest('[data-remove]').dataset.remove); }
    });
    document.addEventListener('input', function (e) {
      if (e.target.matches('[data-search-input]')) renderSearch(e.target.value);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        ['[data-cart]', '[data-search]', '[data-sizeguide]'].forEach(function (s) { if (!$(s).hidden) closeOverlay(s); });
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
    else if (page === 'collections') renderCollections();
    else if (page === 'product') renderProduct();
    else if (page === 'checkout') renderCheckout();
    renderForms();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
