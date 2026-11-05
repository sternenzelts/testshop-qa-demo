import { type Page, type Locator } from '@playwright/test';

export class ContactPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly topicSelect: Locator;
  readonly messageInput: Locator;
  readonly sendButton: Locator;
  readonly alert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.getByLabel('Name');
    this.emailInput = page.getByLabel('Email');
    this.topicSelect = page.getByLabel('Topic');
    this.messageInput = page.getByLabel('Message');
    this.sendButton = page.getByRole('button', { name: /send/i });
    this.alert = page.getByRole('alert');
  }

  async goto() {
    await this.page.goto('/contact');
  }

  async fillForm(data: {
    name: string;
    email: string;
    topic: string;
    message: string;
  }) {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.topicSelect.selectOption(data.topic);
    await this.messageInput.fill(data.message);
  }

  async submit() {
    await this.sendButton.click();
  }
}
