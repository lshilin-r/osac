import { expect, test } from '@playwright/test';

import {
  catalogItemResource,
  expectOsacCommandSucceeded,
  getCatalogItems,
  getCatalogTestConfiguration,
  runOsacCommand,
} from './catalog.cli';

test('deletes a catalog item with the osac CLI', async () => {
  test.setTimeout(180_000);

  const configuration = getCatalogTestConfiguration();
  if (!configuration) {
    test.skip(true, 'OSAC_CATALOG_ITEM_NAME and OSAC_COMPUTE_INSTANCE_TEMPLATE must be set.');
    return;
  }

  // Confirm that the catalog item created by the preceding flow is present.
  const existingItems = await getCatalogItems(configuration.name);
  if (existingItems.length !== 1) {
    throw new Error(
      `Expected exactly one catalog item named '${configuration.name}' before deletion, ` +
        `but found ${existingItems.length}. Run create.catalog.spec.ts first.`,
    );
  }

  // Delete the catalog item by its name.
  const deleteResult = await runOsacCommand(['delete', catalogItemResource, configuration.name]);
  expectOsacCommandSucceeded(deleteResult, `Delete catalog item '${configuration.name}'`);

  // Verify that the deleted catalog item can no longer be found.
  const remainingItems = await getCatalogItems(configuration.name);
  expect(remainingItems).toHaveLength(0);
});
