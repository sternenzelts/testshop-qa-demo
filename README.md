# TestShop

A functional demo shop for evaluating an automated browser testing agent. All catalog values and order data are synthetic. No payments, shipping, or emails occur.

## Run locally

Requires Node.js 18 or later. No dependencies to install.

```sh
npm start
```

Open http://127.0.0.1:4173. To use another port: `node server.mjs 4200`. Serve over HTTP; do not open index.html as a file because browser modules need an HTTP origin.

## Test it

```sh
npm test
```

Eight automated model tests cover the catalog, combined filters, sorting, cart sanitation, stock limits, tax/shipping/discount totals, and delivery validation. See [TEST_CASES.md](TEST_CASES.md) for 24 browser scenarios. The website includes the same guide at `#guide`.

Start every independent run with **Reset demo → Reset everything**. State is saved in the browser's localStorage under `testshop.v1`. New browser profiles begin clean. Search and filters last until reset or page reload; cart, coupon, login, and orders survive reload. Reset clears only this app's stored demo state.

## Demo credentials

- Email: `demo@testshop.example`
- Password: `Test123!`
- Coupon: `SAVE10`, case insensitive
- Example address: Alex Tester, alex@example.com, 123 Test Street, Taipei, 100, Taiwan

## Business rules

- Currency: USD. Prices use integer cents internally.
- Coupon: 10% off merchandise, rounded to cents.
- Shipping: $6, free when discounted merchandise is at least $100. Empty carts have no charges.
- Tax: 8% of discounted merchandise, rounded to cents. Shipping is not taxed.
- Stock limits apply per order and are not globally reduced after checkout.
- Guest checkout works; login is optional.
- Successful checkout creates one order, clears cart/coupon, and preserves login. Order IDs start at `TS-0001` after reset. The latest 100 orders are retained when the page reloads; IDs continue after the highest retained number.
- Checkout validates name, email format, address (at least 5 characters), city, postal code (2–12 letters/numbers/spaces/hyphens), supported country, and the demo acknowledgement.
- Supported countries: United States, United Kingdom, Canada, Taiwan, Australia.

## Automation interface

Prefer accessible roles and field labels. Stable `data-testid` attributes include:

`product-search`, `sort-products`, `price-range`, `in-stock`, `clear-filters`, `product-p01` through `product-p08`, `add-p01` through `add-p08`, `cart-link`, `cart-count`, `cart-item-p01`, `quantity-p01`, `subtotal`, `discount`, `shipping`, `tax`, `total`, `coupon-input`, `apply-coupon`, `checkout-link`, `checkout-name`, `checkout-email`, `checkout-address`, `checkout-city`, `checkout-postal`, `checkout-country`, `checkout-agree`, `place-order`, `login-email`, `login-password`, `sign-in`, `sign-out`, `order-confirmation`, `confirmed-order-id`, `reset-demo`, `confirm-reset`.

Routes: `#shop`, `#product/p01`, `#cart`, `#checkout`, `#login`, `#account`, `#orders`, `#guide`, `#confirmation/TS-0001`.

## Scope and access

This is a static browser testing sandbox. Demo login is a client-side simulation, and guest and signed-in orders share the current browser's local history. There is no real backend, payment integration, authentication service, or cross-device inventory. Use it for browser UI and workflow testing; it does not measure backend security or API reliability.

Sites hosting starts owner-private. An external testing agent may need a browser authenticated as the owner. The local server is available for unrestricted testing on your own machine.

Product images are illustrative Unsplash stock photographs, stored locally so the site has no runtime image dependency. Source URLs are recorded in `dist/assets/sources.json`. They do not establish any supplier relationship or commercial product claim.
