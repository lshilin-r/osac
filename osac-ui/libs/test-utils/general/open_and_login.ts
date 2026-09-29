import { type Page, expect } from '@playwright/test';

import { LoginPage } from '../../locators/login_page';

/**
 * Open a link in the Playwright browser page and verify that the Keycloak
 * login page is displayed.
 */
export const openBrowser = async (page: Page, link: string): Promise<void> => {
  await page.goto(link);
  await expect(LoginPage.brand(page)).toContainText(/osac/i);
  await expect(LoginPage.pageTitle(page)).toBeVisible();
};

/**
 * Open the login page and authenticate with the supplied credentials.
 */
export const openAndLogin = async (
  page: Page,
  link: string,
  username: string,
  password: string,
): Promise<void> => {
  await openBrowser(page, link);

  await LoginPage.username(page).fill(username);
  await LoginPage.signIn(page).click();

  // The first Keycloak may broker to a second Keycloak, which can present
  // another username screen before showing the password field.
  const usernameField = LoginPage.username(page);
  const passwordField = LoginPage.password(page);
  await Promise.race([
    usernameField.waitFor({ state: 'visible' }).catch(() => {}),
    passwordField.waitFor({ state: 'visible' }).catch(() => {}),
  ]);
  if (await usernameField.isVisible().catch(() => false)) {
    await usernameField.fill(username);
    if (!(await passwordField.isVisible().catch(() => false))) {
      await LoginPage.signIn(page).click();
      await passwordField.waitFor({ state: 'visible' });
    }
  }

  await passwordField.fill(password);
  await LoginPage.signIn(page).click();
};
