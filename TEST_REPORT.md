# Goodfinds verification

Verified on 2026-10-26, after the site was rebranded from TestShop to Goodfinds and made to read like a real store. This report concerns the website, not the performance of the user's testing agent.

## What changed

- All visible demo/test wording removed: banner, footer, checkout copy, sign-in credentials box, error hints, and the in-app test guide (`#guide`) and Reset demo control. The served copy of the test cases (`/test-cases.md`) was removed; it now returns 404.
- Renamed throughout: brand, tab titles, account email (`alex@goodfinds.example`), order IDs (`GF-0001`), storage key (`goodfinds.v1`), internal constant names.
- Added real-store pages: About us, Shipping & returns, FAQ, Contact us (validated form), Terms of sale, Privacy policy. The header gained About and Help links. The footer gained link columns, a newsletter sign-up, and a copyright line. The checkout terms checkbox links to the terms page.

## Automated model checks

`node --test tests/model.test.mjs`: **9 passed, 0 failed**.

Coverage: unique catalog and sold-out fixture; combined search/category/stock filters and sorting; invalid cart sanitation and stock caps; exact mug totals; coupon rounding and shipping threshold; empty-cart fees; order IDs after history truncation and beyond four digits; invalid and valid delivery data; contact-form validation (new).

JavaScript syntax checks passed for app.js and model.js.

## Browser verification (re-run after the changes)

Run in fresh browser contexts at 1440×1000 and 390×844:

- All 12 routes (shop, about, shipping, faq, contact, terms, privacy, cart, checkout, login, orders, a product page) render a heading and a matching tab title, with no horizontal overflow and no occurrence of "demo", "simulated", "testing", "testshop", "fictional" or "test guide" in page text.
- Every footer link resolves to a real page. The Help nav item is highlighted on the FAQ page, and FAQ items expand.
- Newsletter: an invalid email shows an error, and a valid email shows the subscribed confirmation.
- Contact: an empty submit shows 4 inline errors and focuses Your name; a valid submit shows the thank-you panel with the sender's name and email.
- Checkout end to end: add Stoneware Mug, fill delivery details, accept terms, and place the order. Confirmation shows `GF-0001`.
- Sign-in: a wrong password shows "Email or password is incorrect."; `alex@goodfinds.example` / `Test123!` signs in, and the profile shows no demo wording.
- `#product/p99` shows "Product not found".
- No console errors or warnings in any of the above.
- Screenshots captured this time (contact page at desktop width, About page at mobile width) show the new pages and footer matching the existing design.

## Not re-run since the changes

These were verified in the earlier pass. Their logic was not changed, only surrounding text, but they were not repeated in the browser this time: coupon totals ($103.20), quantity recalculation ($44.88), double-click creating one order, eight-item stock cap, keyboard focus preservation, the mobile filter toggle, and the 7-error blank checkout.

## Limits

The shop is a static, browser-local simulation. The contact form and newsletter send and store nothing. No backend security, real payment processing, email delivery, cross-device persistence, load testing, or API reliability was tested. The 28 scenarios in TEST_CASES.md are a test plan; this report does not claim every scenario is automated.
