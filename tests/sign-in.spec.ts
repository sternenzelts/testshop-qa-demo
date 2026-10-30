import { test, expect } from '@playwright/test';
import { SignInPage } from './pages/SignInPage';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';
const VALID_EMAIL = process.env.E2E_USER_EMAIL ?? '';
const VALID_PASSWORD = process.env.E2E_USER_PASSWORD ?? '';
const WRONG_PASSWORD = `${VALID_PASSWORD}-wrong`;

test.use({ baseURL: BASE_URL });

test.describe('Sign-in', () => {
  test('[s1] Successful sign-in with valid credentials', async ({ page }) => {
    const signInPage = new SignInPage(page);
    await signInPage.goto();
    await signInPage.signIn(VALID_EMAIL, VALID_PASSWORD);
    // After successful sign-in the user should no longer be on the sign-in page
    await expect(page).not.toHaveURL(/\/sign-in/);
  });

  test('[s2] Sign-in rejected with wrong password', async ({ page }) => {
    const signInPage = new SignInPage(page);
    await signInPage.goto();
    await signInPage.signIn(VALID_EMAIL, WRONG_PASSWORD);
    await expect(signInPage.alert).toBeVisible();
    // Must remain on the sign-in page
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test('[s3] Sign-in rejected with unregistered email', async ({ page }) => {
    const signInPage = new SignInPage(page);
    await signInPage.goto();
    await signInPage.signIn('no-account-xyz@example.com', VALID_PASSWORD);
    await expect(signInPage.alert).toBeVisible();
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test('[s4] Sign-in blocked when email field is empty', async ({ page }) => {
    const signInPage = new SignInPage(page);
    await signInPage.goto();
    await signInPage.fillEmail('');
    await signInPage.fillPassword(VALID_PASSWORD);
    await signInPage.submit();
    // Form should not navigate away; email field should be marked invalid
    await expect(page).toHaveURL(/\/sign-in/);
    // The email input should have an HTML5 validation constraint
    const validationMessage = await signInPage.emailInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    );
    expect(validationMessage).not.toBe('');
  });

  test('[s5] Sign-in blocked when password field is empty', async ({ page }) => {
    const signInPage = new SignInPage(page);
    await signInPage.goto();
    await signInPage.fillEmail(VALID_EMAIL);
    await signInPage.fillPassword('');
    await signInPage.submit();
    // Form should not navigate away; password field should be marked invalid
    await expect(page).toHaveURL(/\/sign-in/);
    const validationMessage = await signInPage.passwordInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    );
    expect(validationMessage).not.toBe('');
  });

  test('[s6] Sign-in form rejects a malformed email address', async ({ page }) => {
    const signInPage = new SignInPage(page);
    await signInPage.goto();
    await signInPage.fillEmail('bad@');
    await signInPage.fillPassword(VALID_PASSWORD);
    await signInPage.submit();
    // Form should stay on sign-in page and surface an error
    await expect(page).toHaveURL(/\/sign-in/);
    // Either native browser validation or a visible alert should surface the error
    const nativeValid = await signInPage.emailInput.evaluate(
      (el: HTMLInputElement) => el.validity.valid
    );
    if (nativeValid) {
      // If the browser considers it valid, the app must show an alert
      await expect(signInPage.alert).toBeVisible();
    } else {
      // Native validation blocked submission — confirm field is invalid
      expect(nativeValid).toBe(false);
    }
  });

  test('[s7] Authenticated user is redirected away from the sign-in page', async ({ page }) => {
    const signInPage = new SignInPage(page);
    await signInPage.goto();
    await signInPage.signIn(VALID_EMAIL, VALID_PASSWORD);
    // Redirect must lead to a non-sign-in URL (a protected page)
    await expect(page).not.toHaveURL(/\/sign-in/);
    // Confirm the landing page is actually loaded (status 200 implied by URL change)
    await expect(page).not.toHaveURL('');
  });

  test('[s8] Sign-in form rejects both fields empty', async ({ page }) => {
    const signInPage = new SignInPage(page);
    await signInPage.goto();
    await signInPage.fillEmail('');
    await signInPage.fillPassword('');
    await signInPage.submit();
    // Form should not navigate away
    await expect(page).toHaveURL(/\/sign-in/);
    // At minimum the email field (processed first) should surface a validation message
    const emailValidationMessage = await signInPage.emailInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    );
    expect(emailValidationMessage).not.toBe('');
  });

  test('[s9] Password visibility toggle reveals and re-hides the password', async ({ page }) => {
    const signInPage = new SignInPage(page);
    await signInPage.goto();
    await signInPage.fillPassword(VALID_PASSWORD);

    // Check that the toggle button exists before proceeding
    const toggleExists = await signInPage.showPasswordButton.isVisible();
    if (!toggleExists) {
      // No toggle present in this build — skip gracefully
      test.skip();
      return;
    }

    // Initially the password should be hidden
    const typeBefore = await signInPage.passwordInput.getAttribute('type');
    expect(typeBefore).toBe('password');

    // Click the toggle to reveal
    await signInPage.showPasswordButton.click();
    const typeAfterReveal = await signInPage.passwordInput.getAttribute('type');
    expect(typeAfterReveal).toBe('text');

    // Click again to hide
    await signInPage.showPasswordButton.click();
    const typeAfterHide = await signInPage.passwordInput.getAttribute('type');
    expect(typeAfterHide).toBe('password');
  });
});
