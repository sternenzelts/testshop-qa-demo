# Goodfinds browser test cases

"Reset" means a fresh browser context (or clearing localStorage key `goodfinds.v1`). Start each independent scenario that way. All data is fictional. See README.md for credentials, selectors, and business rules.

| Case | What to test | Steps | Expected result |
| --- | --- | --- | --- |
| TC01 | Initial catalog | Reset. Open Shop. | 8 products; cart count 0; Desk Lamp is unavailable. |
| TC02 | Search | Search for “mug” (also try “MUG”). | Only Stoneware Mug appears; count is 1 of 8. |
| TC03 | Empty search | Search for “xyz-no-match”. | No results state appears; Clear filters restores all 8. |
| TC04 | Combined filters | Select Desk; enable In-stock items only. | Stoneware Mug and Pocket Notebook appear (2 products). |
| TC05 | Sort products | Clear filters; sort price low to high. | First: Pocket Notebook ($12). Last: Studio Headphones ($89). |
| TC06 | Price limit | Set maximum price to $20. | Stoneware Mug and Pocket Notebook appear. |
| TC07 | Product details | Open Everyday Backpack. | Details show $68, p01, and 8 available per order. |
| TC08 | Add to cart | Reset; add one Stoneware Mug. | Cart count is 1. Subtotal $18; shipping $6; tax $1.44; total $25.44. |
| TC09 | Update quantity | With one mug in cart, increase quantity to 2. | Subtotal $36; shipping $6; tax $2.88; total $44.88. |
| TC10 | Stock limit | Add Everyday Backpack up to quantity 8. | Increase/Add disabled at 8; no ninth item can be added. |
| TC11 | Sold-out item | Open Desk Lamp. | Add is disabled in catalog and details. |
| TC12 | Remove item | Remove the only item from cart. | Cart count becomes 0; empty cart state appears. |
| TC13 | Valid discount | Reset; add backpack + bottle; apply SAVE10. | Subtotal $100; discount $10; shipping $6; tax $7.20; total $103.20. |
| TC14 | Invalid discount | Enter NOTVALID and apply. | Validation error appears; existing applied discount is unchanged. |
| TC15 | Free shipping | Reset; add 2 backpacks; no coupon. | Subtotal $136; free shipping; tax $10.88; total $146.88. |
| TC16 | Invalid sign-in | Submit any incorrect credentials. | Error appears; visitor remains signed out. |
| TC17 | Sign-in and sign-out | Use the README credentials; then sign out from profile. | Header changes to Hi, Alex, then back to Sign in. Cart is preserved. |
| TC18 | Checkout validation | Add a product; open checkout; submit blank form. | 7 inline errors; first invalid field receives focus; no order is created. |
| TC19 | Complete checkout | Use fictional valid delivery details; accept terms of sale; submit. | One confirmation and order record; cart becomes empty; coupon is cleared. |
| TC20 | Repeat submission | Double-click Place order with a valid form. | Only one order is created. |
| TC21 | Persistence | Add a product or place an order, then reload. | Cart, orders, coupon and login persist in this browser; no server account is created. |
| TC22 | Unknown product | Navigate directly to #product/p99. | “Product not found” page appears with a way back to the collection. |
| TC23 | Empty checkout | Reset; navigate directly to #checkout. | Empty-cart prompt appears; no order can be placed. |
| TC24 | Keyboard and mobile | Use Tab/Enter at 390px and desktop widths. | Visible focus, labeled fields, usable filters and navigation; no horizontal page overflow. |
| TC25 | Contact validation | Open Contact us; submit the empty form. | 4 inline errors (name, email, topic, message); focus moves to Your name; no thank-you panel. |
| TC26 | Contact success | Fill name, valid email, a topic, and a 10+ character message; send. | Thank-you panel names the sender and repeats their email. |
| TC27 | Newsletter | In the footer, subscribe with “nope”, then with a valid email. | First shows “Enter a valid email address.”; second shows a subscribed confirmation and clears the field. |
| TC28 | Footer and policy pages | Open every footer link. | Each opens a page with its own heading and tab title; Shipping & returns states $6 shipping, free at $100, 8% tax, 30-day returns. |
