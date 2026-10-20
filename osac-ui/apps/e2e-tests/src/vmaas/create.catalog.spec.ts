import { expect, test } from '@playwright/test';

import {
  expectOsacCommandSucceeded,
  getCatalogItems,
  getCatalogTestConfiguration,
  runOsacCommand,
} from './catalog.cli';

test('creates a catalog item with the osac CLI', async () => {
  test.setTimeout(180_000);

  const configuration = getCatalogTestConfiguration();
  if (!configuration) {
    test.skip(true, 'OSAC_CATALOG_ITEM_NAME and OSAC_COMPUTE_INSTANCE_TEMPLATE must be set.');
    return;
  }

  // Verify the name is available before attempting creation.
  const existingItems = await getCatalogItems(configuration.name);
  if (existingItems.length !== 0) {
    throw new Error(
      `Catalog item '${configuration.name}' already exists. Choose another OSAC_CATALOG_ITEM_NAME.`,
    );
  }

  // Create a published ComputeInstance catalog item from the configured template.
  const createResult = await runOsacCommand([
    'create',
    'computeinstancecatalogitem',
    '--name',
    configuration.name,
    '--title',
    configuration.title,
    '--description',
    configuration.description,
    '--template',
    configuration.template,
    '--published',
  ]);
  expectOsacCommandSucceeded(createResult, `Create catalog item '${configuration.name}'`);

  // Verify the created object and its user-visible metadata through the CLI.
  const createdItems = await getCatalogItems(configuration.name);
  expect(createdItems).toHaveLength(1);
  expect(createdItems[0]?.metadata?.name).toBe(configuration.name);
  expect(createdItems[0]?.title).toBe(configuration.title);
  expect(createdItems[0]?.description).toBe(configuration.description);
  expect(createdItems[0]?.template?.id).toBeTruthy();
});
