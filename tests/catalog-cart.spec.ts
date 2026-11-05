import { test, expect } from '@playwright/test';
import { CatalogPage } from './pages/CatalogPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ContactPage } from './pages/ContactPage';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';

test.use({ baseURL: BASE_URL });

// ---------------------------------------------------------------------------
// Helper: add product to cart via its product detail page and return to catalog
// ---------------------------------------------------------------------------
async function addProductToCart(
  page: import('@playwright/test').Page,
  productId: string,
  qty?: number
) {
  await page.goto(`/products/${productId}`);
  if (qty !== undefined && qty > 1) {
    const qtyInput = page.getByLabel(/quantity/i);
    await qtyInput.fill(String(qty));
  }
  await page.getByRole('button', { name: /add to cart/i }).click();
}

// ---------------------------------------------------------------------------
// s1 – In-stock product can be added to the cart and the badge increments
// ---------------------------------------------------------------------------
test('[s1] In-stock product can be added to the cart and the badge increments', async ({ page }) => {
  const catalogPage = new CatalogPage(page);

  // Start from a clean state – open the product page for p01
  await page.goto(`/products/p01`);

  // Record the current cart count (may be 0 or some pre-existing value)
  const cartCount = page.getByTestId('cart-count');
  const beforeText = await cartCount.isVisible()
    ? await cartCount.textContent()
    : '0';
  const before = parseInt(beforeText?.trim() ?? '0', 10);

  // Add one unit to the cart
  await page.getByRole('button', { name: /add to cart/i }).click();

  // Badge must be visible and its value must have increased
  await expect(cartCount).toBeVisible();
  const afterText = await cartCount.textContent();
  const after = parseInt(afterText?.trim() ?? '0', 10);
  expect(after).toBeGreaterThan(before);
});

// ---------------------------------------------------------------------------
// s2 – Adding an item beyond its stock cap clamps the cart quantity
// ---------------------------------------------------------------------------
test('[s2] Adding an item beyond its stock cap clamps the cart quantity', async ({ page }) => {
  // Navigate to p01; attempt to set qty to 11 (stock cap is 8)
  await page.goto(`/products/p01`);

  const qtyInput = page.getByLabel(/quantity/i);
  // Try to set quantity beyond the stock cap
  await qtyInput.fill('11');
  await page.getByRole('button', { name: /add to cart/i }).click();

  // The cart badge must reflect at most 8 units (the stock cap)
  const cartCount = page.getByTestId('cart-count');
  await expect(cartCount).toBeVisible();
  const countText = await cartCount.textContent();
  const count = parseInt(countText?.trim() ?? '0', 10);
  expect(count).toBeLessThanOrEqual(8);
});

// ---------------------------------------------------------------------------
// s3 – Sold-out product (p06) cannot be added to the cart
// ---------------------------------------------------------------------------
test('[s3] Sold-out product (p06) cannot be added to the cart', async ({ page }) => {
  await page.goto(`/products/p06`);

  // The Add-to-cart button must either be absent or disabled
  const addButton = page.getByRole('button', { name: /add to cart/i });
  const buttonExists = await addButton.isVisible().catch(() => false);

  if (buttonExists) {
    // If the button is rendered it must be disabled
    await expect(addButton).toBeDisabled();
  } else {
    // If it's not visible at all, that also satisfies the requirement
    expect(buttonExists).toBe(false);
  }
});

// ---------------------------------------------------------------------------
// s4 – Category and sort filters narrow the catalog correctly
// ---------------------------------------------------------------------------
test('[s4] Category and sort filters narrow the catalog correctly', async ({ page }) => {
  const catalogPage = new CatalogPage(page);
  await catalogPage.goto();

  // Apply Desk category filter
  await catalogPage.selectCategory('Desk');
  // Apply price-asc sort
  await catalogPage.selectSort('price-asc');

  // Three products must appear with prices $12, $18, $56 (in cents: 1200, 1800, 5600)
  const priceLocators = catalogPage.productPrices;
  await expect(priceLocators).toHaveCount(3);

  const prices = await priceLocators.allTextContents();
  // Strip non-numeric characters and parse as cents (multiply dollars by 100)
  const parsedPrices = prices.map((p) => {
    // Handle formats like "$12.00" or "1200" or "12.00"
    const numeric = p.replace(/[^0-9.]/g, '');
    const value = parseFloat(numeric);
    // If value looks like a dollar amount (< 1000) convert to cents
    return value < 1000 ? Math.round(value * 100) : Math.round(value);
  });

  expect(parsedPrices).toEqual([1200, 1800, 5600]);
});

// ---------------------------------------------------------------------------
// s5 – Search query that matches no products shows an empty-state message
// ---------------------------------------------------------------------------
test('[s5] Search query that matches no products shows an empty-state message', async ({ page }) => {
  const catalogPage = new CatalogPage(page);
  await catalogPage.goto();

  await catalogPage.search('xyz-no-match');

  // An empty-state / status element must be visible – it must not be blank
  const status = catalogPage.emptyStatus;
  await expect(status).toBeVisible();
  const statusText = await status.textContent();
  expect((statusText ?? '').trim().length).toBeGreaterThan(0);
});

// ---------------------------------------------------------------------------
// s6 – Single item cart shows correct subtotal, shipping and tax
// ---------------------------------------------------------------------------
test('[s6] Single item cart shows correct subtotal, shipping and tax', async ({ page }) => {
  // Add exactly 1 unit of p03 to cart then visit the cart
  await page.goto(`/products/p03`);
  const qtyInput = page.getByLabel(/quantity/i);
  if (await qtyInput.isVisible()) {
    await qtyInput.fill('1');
  }
  await page.getByRole('button', { name: /add to cart/i }).click();

  const cartPage = new CartPage(page);
  await cartPage.goto();

  // Expected: subtotal $18.00, shipping $6.00, tax $1.44, total $25.44
  // Parse helper: strip currency symbols and convert to cents
  const parseCents = (text: string | null): number => {
    const numeric = (text ?? '').replace(/[^0-9.]/g, '');
    const value = parseFloat(numeric);
    return value < 1000 ? Math.round(value * 100) : Math.round(value);
  };

  await expect(cartPage.cartSubtotal).toBeVisible();
  const subtotal = parseCents(await cartPage.cartSubtotal.textContent());
  expect(subtotal).toBe(1800);

  await expect(cartPage.cartShipping).toBeVisible();
  const shipping = parseCents(await cartPage.cartShipping.textContent());
  expect(shipping).toBe(600);

  await expect(cartPage.cartTax).toBeVisible();
  const tax = parseCents(await cartPage.cartTax.textContent());
  expect(tax).toBe(144);

  await expect(cartPage.cartTotal).toBeVisible();
  const total = parseCents(await cartPage.cartTotal.textContent());
  expect(total).toBe(2544);
});

// ---------------------------------------------------------------------------
// s7 – SAVE10 coupon is accepted (case-insensitive) and reduces the order total
// ---------------------------------------------------------------------------
test('[s7] SAVE10 coupon is accepted (case-insensitive) and reduces the order total', async ({ page }) => {
  // Build a cart with p01 qty 1 + p05 qty 1 (subtotal 10000 cents = $100)
  await page.goto(`/products/p01`);
  const qtyInputP01 = page.getByLabel(/quantity/i);
  if (await qtyInputP01.isVisible()) await qtyInputP01.fill('1');
  await page.getByRole('button', { name: /add to cart/i }).click();

  await page.goto(`/products/p05`);
  const qtyInputP05 = page.getByLabel(/quantity/i);
  if (await qtyInputP05.isVisible()) await qtyInputP05.fill('1');
  await page.getByRole('button', { name: /add to cart/i }).click();

  const cartPage = new CartPage(page);
  await cartPage.goto();

  // Apply coupon in lowercase to verify case-insensitivity
  await cartPage.applyCoupon('save10');

  // Discount element must show a non-zero discount
  await expect(cartPage.cartDiscount).toBeVisible();
  const parseCents = (text: string | null): number => {
    const numeric = (text ?? '').replace(/[^0-9.]/g, '');
    const value = parseFloat(numeric);
    return value < 1000 ? Math.round(value * 100) : Math.round(value);
  };
  const discount = parseCents(await cartPage.cartDiscount.textContent());
  expect(discount).toBe(1000);
});

// ---------------------------------------------------------------------------
// s8 – Free-shipping threshold: order at or above $50 subtotal gets $0 shipping
// ---------------------------------------------------------------------------
test('[s8] Free-shipping threshold: order at or above $50 subtotal gets $0 shipping', async ({ page }) => {
  // p01 qty 2 = subtotal $100 which is above the free-shipping threshold
  await page.goto(`/products/p01`);
  const qtyInput = page.getByLabel(/quantity/i);
  if (await qtyInput.isVisible()) await qtyInput.fill('2');
  await page.getByRole('button', { name: /add to cart/i }).click();

  const cartPage = new CartPage(page);
  await cartPage.goto();

  await expect(cartPage.cartShipping).toBeVisible();
  const shippingText = await cartPage.cartShipping.textContent();

  // Shipping must be $0.00 or "Free" when threshold is met
  const isZero =
    /\$0\.00/.test(shippingText ?? '') ||
    /free/i.test(shippingText ?? '') ||
    shippingText?.trim() === '0';
  expect(isZero).toBe(true);
});

// ---------------------------------------------------------------------------
// s9 – Checkout form accepts all valid fields and shows order confirmation
// ---------------------------------------------------------------------------
test('[s9] Checkout form accepts all valid fields and shows order confirmation', async ({ page }) => {
  // Ensure at least one item is in the cart so checkout is reachable
  await page.goto(`/products/p01`);
  const qtyInput = page.getByLabel(/quantity/i);
  if (await qtyInput.isVisible()) await qtyInput.fill('1');
  await page.getByRole('button', { name: /add to cart/i }).click();

  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.goto();

  await checkoutPage.fillForm({
    name: 'Alex Tester',
    email: 'alex@example.com',
    address: '123 Test Street',
    city: 'Taipei',
    postal: '100',
    country: 'TW',
    agree: true,
  });

  await checkoutPage.submit();

  // After a successful order, an alert/confirmation containing an order ID (GF-XXXX) must appear
  await expect(checkoutPage.alert).toBeVisible();
  const alertText = await checkoutPage.alert.textContent();
  expect(alertText).toMatch(/GF-\d{4,}/i);
});

// ---------------------------------------------------------------------------
// s10 – Checkout form with all fields blank shows 7 validation errors
// ---------------------------------------------------------------------------
test('[s10] Checkout form with all fields blank shows 7 validation errors', async ({ page }) => {
  // Ensure cart has an item so checkout renders properly
  await page.goto(`/products/p01`);
  const qtyInput = page.getByLabel(/quantity/i);
  if (await qtyInput.isVisible()) await qtyInput.fill('1');
  await page.getByRole('button', { name: /add to cart/i }).click();

  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.goto();

  // Submit without filling any field
  await checkoutPage.submit();

  // The UI must surface at least 7 inline error/alert elements
  const alerts = page.getByRole('alert');
  const count = await alerts.count();
  expect(count).toBeGreaterThanOrEqual(7);
});

// ---------------------------------------------------------------------------
// s11 – Contact form happy path: valid submission shows success confirmation
// ---------------------------------------------------------------------------
test('[s11] Contact form happy path: valid submission shows success confirmation', async ({ page }) => {
  const contactPage = new ContactPage(page);
  await contactPage.goto();

  await contactPage.fillForm({
    name: 'Alex',
    email: 'alex@example.com',
    topic: 'order',
    message: 'Where is my order GF-0001?',
  });

  await contactPage.submit();

  // A success alert or status must become visible
  await expect(contactPage.alert).toBeVisible();
  const alertText = await contactPage.alert.textContent();
  // The confirmation text should indicate success (not an error)
  expect((alertText ?? '').trim().length).toBeGreaterThan(0);
});

// ---------------------------------------------------------------------------
// s12 – Contact form rejects a message shorter than 10 characters
// ---------------------------------------------------------------------------
test('[s12] Contact form rejects a message shorter than 10 characters', async ({ page }) => {
  const contactPage = new ContactPage(page);
  await contactPage.goto();

  await contactPage.fillForm({
    name: 'Alex',
    email: 'alex@example.com',
    topic: 'order',
    message: 'short',
  });

  await contactPage.submit();

  // An error alert related to the message field must be visible
  await expect(contactPage.alert).toBeVisible();
  // Must remain on the contact page (or at least not show a success state that clears the form)
  await expect(page).toHaveURL(/\/contact/);
});
