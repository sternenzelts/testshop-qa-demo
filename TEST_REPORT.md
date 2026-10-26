# TestShop verification

Verified on 2026-10-26. This report concerns the completed demo website, not the performance of the user's testing agent.

## Automated model checks

`node --test tests/model.test.mjs`: **8 passed, 0 failed**.

Coverage: unique catalog and sold-out fixture; combined search/category/stock filters and sorting; invalid cart sanitation and stock caps; exact mug totals; coupon rounding and shipping threshold; empty-cart fees; order IDs after history truncation and beyond four digits; invalid and valid delivery data.

JavaScript syntax checks passed for app.js, model.js, and the local server.

## Browser verification

**23 explicit assertions passed** against the local running website using browser UI actions:

- One mug totals $25.44; quantity two recalculates to $44.88.
- Invalid coupons are rejected; SAVE10 on backpack + bottle totals $103.20.
- Guest checkout creates a confirmation, clears the cart, and persists after reload.
- A double-click on the order button creates one order.
- Invalid demo credentials are rejected; valid credentials sign in; sign-out works.
- Empty search, combined filters, ascending sort, sold-out controls, and eight-item stock cap behave correctly.
- Mobile stock filter works.
- Add and quantity updates preserve keyboard focus; the skip link focuses main without changing the cart route.
- Canceling reset preserves state; confirming restores eight products and an empty cart.
- All 24 documented scenario rows appear in the in-app test guide.

Additional observations: submitting a blank checkout produced all seven required inline errors and focused Full name. No console errors or warnings were recorded during the tested journeys. Product images loaded without broken-image errors.

Responsive DOM checks: at a 390×844 viewport override, client width was 375px after the scrollbar, scroll width matched, and the catalog had two columns. At a 1440×1000 override, client/scroll width matched at 1425px and the catalog had three columns. There was no horizontal page overflow in those inspected states.

## Review and limits

An independent source review identified mutation focus loss and order-ID reuse after retained history reached 100. Both were fixed, and the reviewer scored both fixes resolved. The history regression is covered by an automated test.

Browser screenshot capture returned “Unable to capture screenshot” through both documented capture methods. Visual composition, rendered contrast, image crops, and polish were not verified from screenshots. Responsive DOM checks do not replace visual inspection. The 24 scenarios are a reusable test plan; this report does not claim that every scenario has been fully automated.

The shop is a static, browser-local simulation. No backend security, real payment processing, email delivery, cross-device persistence, load testing, or API reliability was tested.
