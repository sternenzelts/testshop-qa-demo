import { type Page, type Locator } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly postalInput: Locator;
  readonly countryInput: Locator;
  readonly agreeCheckbox: Locator;
  readonly placeOrderButton: Locator;
  readonly alert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.getByLabel('Name');
    this.emailInput = page.getByLabel('Email');
    this.addressInput = page.getByLabel('Address');
    this.cityInput = page.getByLabel('City');
    this.postalInput = page.getByLabel('Postal');
    this.countryInput = page.getByLabel('Country');
    this.agreeCheckbox = page.getByLabel(/agree/i);
    this.placeOrderButton = page.getByRole('button', { name: /place order/i });
    this.alert = page.getByRole('alert');
  }

  async goto() {
    await this.page.goto('/checkout');
  }

  async fillForm(data: {
    name: string;
    email: string;
    address: string;
    city: string;
    postal: string;
    country: string;
    agree: boolean;
  }) {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.addressInput.fill(data.address);
    await this.cityInput.fill(data.city);
    await this.postalInput.fill(data.postal);
    await this.countryInput.fill(data.country);
    if (data.agree) {
      await this.agreeCheckbox.check();
    }
  }

  async submit() {
    await this.placeOrderButton.click();
  }
}
