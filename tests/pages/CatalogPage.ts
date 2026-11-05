import { type Page, type Locator } from '@playwright/test';

export class CatalogPage {
  readonly page: Page;
  readonly addToCartButton: Locator;
  readonly cartCount: Locator;
  readonly quantityInput: Locator;
  readonly categorySelect: Locator;
  readonly sortSelect: Locator;
  readonly productPrices: Locator;
  readonly searchBox: Locator;
  readonly emptyStatus: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = page.getByRole('button', { name: /add to cart/i });
    this.cartCount = page.getByTestId('cart-count');
    this.quantityInput = page.getByLabel(/quantity/i);
    this.categorySelect = page.getByRole('combobox', { name: /category/i });
    this.sortSelect = page.getByRole('combobox', { name: /sort/i });
    this.productPrices = page.getByTestId('product-price');
    this.searchBox = page.getByRole('searchbox');
    this.emptyStatus = page.getByRole('status');
  }

  async goto() {
    await this.page.goto('/');
  }

  async gotoProduct(productId: string) {
    await this.page.goto(`/products/${productId}`);
  }

  async selectCategory(category: string) {
    await this.categorySelect.selectOption(category);
  }

  async selectSort(sort: string) {
    await this.sortSelect.selectOption(sort);
  }

  async search(query: string) {
    await this.searchBox.fill(query);
    await this.page.keyboard.press('Enter');
  }
}
