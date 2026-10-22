import { type Locator, type Page, expect } from '@playwright/test';

import { CatalogMainPage } from '../../locators/catalog';

const getCatalogItemCard = (page: Page, name: string): Locator =>
  page.locator(...CatalogMainPage.catalogItemCards).filter({
    has: page.getByRole('link', { name, exact: true }),
  });

/** Verify that a catalog item is shown with its expected card values. */
export const expectCatalogItemListed = async (
  page: Page,
  name: string,
  expectedType: string,
  expectedStatus: string,
  expectedUsage: string,
): Promise<void> => {
  const catalogItemCard = getCatalogItemCard(page, name);

  await expect(catalogItemCard).toHaveCount(1);
  await expect(catalogItemCard.getByRole('link', { name, exact: true })).toBeVisible();
  await expect(catalogItemCard.locator(...CatalogMainPage.catalogItemLabels)).toHaveText([
    expectedType,
    expectedStatus,
  ]);
  await expect(catalogItemCard.locator(...CatalogMainPage.catalogItemVisibility)).toContainText(
    expectedUsage,
  );
};

/** Verify that a catalog item is absent from the Catalog page. */
export const expectCatalogItemNotListed = async (page: Page, name: string): Promise<void> => {
  await expect(getCatalogItemCard(page, name)).toHaveCount(0);
};
