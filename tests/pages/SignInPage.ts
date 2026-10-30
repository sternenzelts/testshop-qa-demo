import { type Page, type Locator } from '@playwright/test';

export class SignInPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly alert: Locator;
  readonly showPasswordButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.signInButton = page.getByRole('button', { name: /sign in/i });
    this.alert = page.getByRole('alert');
    this.showPasswordButton = page.getByRole('button', { name: /show password/i });
  }

  async goto() {
    await this.page.goto('/sign-in');
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async submit() {
    await this.signInButton.click();
  }

  async signIn(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
  }
}
