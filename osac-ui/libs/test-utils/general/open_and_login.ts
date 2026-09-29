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

  await LoginPage.password(page).fill(password);
  await LoginPage.signIn(page).click();
};
