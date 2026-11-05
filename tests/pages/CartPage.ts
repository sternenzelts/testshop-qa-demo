import { type Page, type Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartSubtotal: Locator;
  readonly cartShipping: Locator;
  readonly cartTax: Locator;
  readonly cartTotal: Locator;
  readonly cartDiscount: Locator;
  readonly cartCount: Locator;
  readonly couponInput: Locator;
  readonly applyButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartSubtotal = page.getByTestId('cart-subtotal');
    this.cartShipping = page.getByTestId('cart-shipping');
    this.cartTax = page.getByTestId('cart-tax');
    this.cartTotal = page.getByTestId('cart-total');
    this.cartDiscount = page.getByTestId('cart-discount');
    this.cartCount = page.getByTestId('cart-count');
    this.couponInput = page.getByLabel(/coupon/i);
    this.applyButton = page.getByRole('button', { name: /apply/i });
  }

  async goto() {
    await this.page.goto('/cart');
  }

  async applyCoupon(code: string) {
    await this.couponInput.fill(code);
    await this.applyButton.click();
  }
}
