# Goodfinds

A functional shop for evaluating an automated browser testing agent. The site itself reads like a real store (no visible demo or test wording, no on-site test guide) so the agent has to work it out on its own. All catalog values and order data are synthetic. No payments, shipping, or emails occur.

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

Nine automated model tests cover the catalog, combined filters, sorting, cart sanitation, stock limits, tax/shipping/discount totals, delivery validation, and contact-form validation. See [TEST_CASES.md](TEST_CASES.md) for 28 browser scenarios. The website does not publish them; give them to the agent separately if needed.

Start every independent run in a fresh browser context, or clear localStorage key `goodfinds.v1`. New browser profiles begin clean. Search and filters last until page reload; cart, coupon, login, and orders survive reload.

## Credentials

The sign-in page does not display these; give them to the agent.

- Email: `alex@goodfinds.example`
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
- Successful checkout creates one order, clears cart/coupon, and preserves login. Order IDs start at `GF-0001` in a clean browser. The latest 100 orders are retained when the page reloads; IDs continue after the highest retained number.
- Checkout validates name, email format, address (at least 5 characters), city, postal code (2–12 letters/numbers/spaces/hyphens), supported country, and the terms-of-sale checkbox.
- Supported countries: United States, United Kingdom, Canada, Taiwan, Australia.
- Contact form requires a name, valid email, a topic, and a message of at least 10 characters. A valid message shows a thank-you panel; nothing is sent or stored.
- Newsletter sign-up in the footer validates the email and shows a confirmation; nothing is sent or stored.
- Info pages (About, Shipping & returns, FAQ, Terms, Privacy) restate the rules above, so the agent can cross-check copy against behavior.

## Automation interface

Prefer accessible roles and field labels. Stable `data-testid` attributes include:

`product-search`, `sort-products`, `price-range`, `in-stock`, `clear-filters`, `product-p01` through `product-p08`, `add-p01` through `add-p08`, `cart-link`, `cart-count`, `cart-item-p01`, `quantity-p01`, `subtotal`, `discount`, `shipping`, `tax`, `total`, `coupon-input`, `apply-coupon`, `checkout-link`, `checkout-name`, `checkout-email`, `checkout-address`, `checkout-city`, `checkout-postal`, `checkout-country`, `checkout-agree`, `place-order`, `login-email`, `login-password`, `sign-in`, `sign-out`, `order-confirmation`, `confirmed-order-id`, `contact-name`, `contact-email`, `contact-topic`, `contact-message`, `contact-submit`, `contact-success`, `newsletter-email`, `newsletter-submit`.

Routes: `#shop`, `#product/p01`, `#cart`, `#checkout`, `#login`, `#account`, `#orders`, `#confirmation/GF-0001`, `#about`, `#shipping`, `#faq`, `#contact`, `#terms`, `#privacy`.

## Scope and access

This is a static browser testing sandbox. Login is a client-side simulation, and guest and signed-in orders share the current browser's local history. There is no real backend, payment integration, authentication service, or cross-device inventory. Use it for browser UI and workflow testing; it does not measure backend security or API reliability.

Sites hosting starts owner-private. An external testing agent may need a browser authenticated as the owner. The local server is available for unrestricted testing on your own machine.

Product images are illustrative Unsplash stock photographs, stored locally so the site has no runtime image dependency. Source URLs are recorded in `dist/assets/sources.json`. They do not establish any supplier relationship or commercial product claim.
