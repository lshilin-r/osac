import { expect, test } from '@playwright/test';

import { catalogTestData } from './test_data';
import { getCatalogItems } from '../../../../libs/osac-cli/src/catalog';
import { expectOsacCommandSucceeded, runOsacCommand } from '../../../../libs/osac-cli/src/cli';
import { expectCatalogItemListed } from '../../../../libs/test-utils/src/catalog.page';
import { openAndLoginWithEnvironment } from '../../../../libs/test-utils/src/general/open_and_login';
import { openCatalogPage } from '../../../../libs/test-utils/src/main.page';

test('creates a catalog item with the osac CLI and lists it in Catalog', async ({ page }) => {
  test.setTimeout(180_000);

  // Verify the name is available before attempting creation.
  const existingItems = await getCatalogItems(catalogTestData.name);
  if (existingItems.length !== 0) {
    throw new Error(
      `Catalog item '${catalogTestData.name}' already exists. ` +
        'Choose another catalog_item_name in extravars.yaml.',
    );
  }

  // Create a published ComputeInstance catalog item from the configured template.
  const createResult = await runOsacCommand([
    'create',
    'computeinstancecatalogitem',
    '--name',
    catalogTestData.name,
    '--title',
    catalogTestData.title,
    '--description',
    catalogTestData.description,
    '--template',
    catalogTestData.template,
    '--published',
  ]);
  expectOsacCommandSucceeded(createResult, `Create catalog item '${catalogTestData.name}'`);

  // Verify the created object and its user-visible metadata through the CLI.
  const createdItems = await getCatalogItems(catalogTestData.name);
  expect(createdItems).toHaveLength(1);
  expect(createdItems[0]?.metadata?.name).toBe(catalogTestData.name);
  expect(createdItems[0]?.title).toBe(catalogTestData.title);
  expect(createdItems[0]?.description).toBe(catalogTestData.description);
  expect(createdItems[0]?.template?.id).toBeTruthy();

  // Open the browser, authenticate, and verify the created catalog item in the UI.
  await openAndLoginWithEnvironment(page, '/');
  await openCatalogPage(page);
  await expectCatalogItemListed(page, catalogTestData.name);
});
