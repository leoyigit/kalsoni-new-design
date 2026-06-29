# Kalsoni Mockup v2 — Implement Merchant Feedback

## Context

The merchant reviewed the v1 static mockup ([kalsoni-mockup/](kalsoni-mockup/)) and gave consolidated feedback + competitive research (now captured in [kalsoni-feedback/merchant-feedback.md](kalsoni-feedback/merchant-feedback.md)). The core problems with v1:

- It ships **placeholder demo products** (generic jackets, leggings, tees) that don't match Kalsoni's real catalog, so the merchandising recommendations (Color Packs, "Biftu Collection" naming, category tiles) have nothing real to attach to.
- The **Sport Hijabs & Shawls** category — a real revenue driver and brand differentiator — isn't featured.
- PDPs show only 3 borrowed images and a generic "You may also like"; the merchant wants 5+ shots per color and a curated "Complete the Look".
- No bundle-first merchandising, no shoppable UGC, no editorial/lookbook page, no Schools & Teams bulk-order flow, and the B Corp credential is missing.

**Goal:** create a new `kalsoni-mockup-v2/` folder (v1 left untouched for comparison) that implements the feedback. Decisions confirmed with user: **use the real catalog** (placeholder photos where real ones are TBD), **fully mock the "future/TBD" items** as placeholders, and **extend the existing wholesale page** with a Schools & Teams bulk section.

The v1 architecture is clean and we reuse it wholesale: a shared data layer [data.js](kalsoni-mockup/data.js) (`window.KALSONI`) + [app.js](kalsoni-mockup/app.js) that injects header/footer/overlays and runs a per-page renderer keyed off `body[data-page]`, plus one [style.css](kalsoni-mockup/style.css). No build step.

---

## Step 0 — Create the v2 folder

Copy the whole folder so v1 stays intact: `cp -R kalsoni-mockup kalsoni-mockup-v2`. All edits below happen inside `kalsoni-mockup-v2/`. Bump the cart key in `app.js` (`kalsoni-cart-v1` → `kalsoni-cart-v2`) so stale v1 carts don't mix.

---

## Step 1 — Real catalog in `data.js` (foundational)

Rewrite the `products`, `collections`, and `sizeRows` arrays to the real catalog and add fields the new features need.

**New category model** (4 categories, matching the requested homepage tiles):
`tops`, `bottoms`, `hijabs-shawls` (label "SPORT HIJABS & SHAWLS"), `bundles`.

**Products** (reuse existing CDN image constants as placeholders):

| Product | category | colors | sizes |
| :- | :- | :- | :- |
| Biftu Mid-Length Tunic | tops | 5 | XS–5XL |
| Biftu Full-Length Tunic | tops | 4 | XS–5XL |
| Wide Leg Pant | bottoms | 2 | XS–5XL |
| Joggers | bottoms | 2 | XS–5XL |
| Safiya Sport Hijab | hijabs-shawls | 1 | 2 sizes |
| Mako Sport Hijab | hijabs-shawls | 3 | One Size |
| Safiya Sport Shawl | hijabs-shawls | 3 | One Size |
| Mako Sport Shawl | hijabs-shawls | 4 | One Size |
| The Complete Set | bundles | — | XS–5XL |
| Starter Kit | bundles | — | XS–5XL |
| Mix & Match 3 | bundles | — | XS–5XL |

`XS–5XL` = `['XS','S','M','L','XL','XXL','3XL','4XL','5XL']`; extend `sizeRows` to cover 3XL/4XL/5XL.

**New per-product fields** (additive, so renderers can be incremental):
- `collection` — named collection string (e.g. "The Biftu Collection", "The Performance Hijab Collection") → Feedback C.
- `gallery` — array of `{label, img}` for the 5-shot standard (`front, side, back, detail, flat-lay`), placeholders for now → Feedback D / PDP.
- `completeLook` — array of product ids (tunic → matching pant/jogger + hijab/shawl) → Feedback B.
- `fabricTech` — one of `KalFlex` / `BreezeLuxe` / `SolShield` (ties PDP to [fabric.html](kalsoni-mockup/fabric.html)) → Qynda named-fabric.
- Bundle products get `bundle: true` + `includes: [ids]` so they render as their own product *type*, not a discount → Feedback E.

Rewrite `collections` to the named collections (The Biftu Collection, The Performance Hijab Collection, Bottoms, Bundles). Add two new data arrays: `ugcPosts` (`{img, productId}` for shoppable Instagram) and `lookbook` (editorial story blocks).

---

## Step 2 — `app.js` renderers & shared chrome

- **`cardHTML`**: add hover image-swap model→flat-lay (RAINS) using `gallery[1]`; show color count ("5 Colors") for color-pack framing (ASRV).
- **`headerHTML` / `footerHTML`**: footer adds a **"Bulk Orders (Schools & Teams)"** link (→ `wholesale.html#bulk`) and a permanent **B Corp** trust badge site-wide (Feedback 7.1 / 7.2); add a **Lookbook** nav item.
- **`overlaysHTML` + boot**: add a one-time **welcome pop-up** (Oiselle) — "what activities do you do?" chips → email capture, gated by a `localStorage` flag.
- **`renderHome`**: 4 **category tiles** (Tops, Bottoms, Sport Hijabs & Shawls, Bundles); a dedicated full-width **Sport Hijabs & Shawls feature block** (Knix-style, prominent); **bundle-led** featured row; **shoppable UGC** strip (`ugcPosts` linked to PDPs).
- **`renderProduct`**: per-color **5-image gallery** from `gallery`; **"Complete the Look"** module from `completeLook` (separate from "You may also like"); **named collection** + **fabric-tech link** to fabric.html; **bundle variant** — when `p.bundle`, render a "What's included" list instead of the single size grid.
- **`renderShop`**: filter pills → All / Tops / Bottoms / Sport Hijabs & Shawls / Bundles.
- **`renderCollections`**: drive off the rewritten named `collections`.
- **`renderLookbook`** (new): editorial "drop" page (Merrachi Discover Lookbook).

---

## Step 3 — Page shells (HTML, in v2)

- **[index.html](kalsoni-mockup/index.html)**: full-bleed hero (Oiselle "one image fills the screen") with a "Discover Lookbook" link; new category-tile + hijab-feature + bundle + UGC sections (containers rendered by app.js); add **B Corp** to the "STOCKED AT" stockist strip; add a B Corp explainer line in the `#about` mission block; near-footer text link "Buying for a team or school? Let's talk." → `wholesale.html#bulk`.
- **New `lookbook.html`**: shell with `data-page="lookbook"`.
- **New `affiliate.html`**: simple placeholder affiliate program page (Karma) + footer link.
- **[wholesale.html](kalsoni-mockup/wholesale.html)**: add a `#bulk` "Schools & Teams" section with its own inquiry form (org name, contact, estimated quantity, products of interest) using the existing `data-toast-form` pattern.
- PDP/shop/collections shells need no change (rendered by app.js).

---

## Step 4 — `style.css`

Append new sections (reuse existing `--` design tokens and `.eyebrow`/`.btn`/`.section` patterns): full-bleed hero variant, 4-up category-tile grid, hijab feature block, card hover image-swap, PDP gallery + Complete-the-Look module, bundle "includes" list, lookbook layout, welcome popup, B Corp badge, and the bulk-orders form.

---

## Feedback → change traceability

- **A Color packs** → swatches on one PDP (already) + "N Colors" on cards + collection naming.
- **B Complete the Look** → `completeLook` field + PDP module.
- **C Collection naming** → `collection` field + rewritten collections page.
- **D 5–6 images** → `gallery` field + PDP gallery.
- **E Bundles as a type** → bundle products with `bundle/includes` + bundle PDP variant.
- **F Lookbook** → new `lookbook.html` + `renderLookbook`.
- **Homepage** → full-bleed hero, 4 tiles, hijab feature, shoppable UGC, B Corp strip.
- **PDP** → swatches, 5 images, modal size guide (already a modal), Complete the Look.
- **Wholesale/Bulk** → `#bulk` section + footer/homepage links.
- **B Corp** → stockist strip, footer badge, About explainer.
- **Other** → fabric-tech link (Qynda), welcome popup (Oiselle), affiliate page (Karma).

## Notes / placeholders
Real product photography is TBD per the merchant — v2 wires labeled placeholder slots (reusing existing CDN imagery) so real front/side/back/detail/flat-lay assets drop straight in. The B Corp "logo" will be an inline SVG/text badge placeholder (no external asset).

## Verification
1. `cd kalsoni-mockup-v2 && python3 -m http.server 8000`, then open via the chrome-devtools MCP (or browser).
2. **Home**: 4 category tiles present, Sport Hijabs & Shawls feature prominent, bundles featured, B Corp in stockist strip + footer, shoppable UGC links to a PDP, welcome popup shows once.
3. **PDP** (Biftu Mid-Length Tunic): 5-image gallery, color swatches update gallery, Complete the Look shows a pant + hijab, fabric link → fabric.html, size-guide opens as modal.
4. **Bundle PDP** (The Complete Set): renders "What's included" instead of size grid; adds to cart.
5. **Shop**: filters Tops / Bottoms / Sport Hijabs & Shawls / Bundles work.
6. **Lookbook** + **Affiliate** pages render; **Wholesale** `#bulk` section + form toast works.
7. Cart drawer/checkout still function end-to-end (new `kalsoni-cart-v2` key).
