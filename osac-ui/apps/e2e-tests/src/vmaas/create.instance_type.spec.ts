import { test } from '@playwright/test';

import { openAndLoginWithEnvironment } from '../../../../libs/test-utils/src/general/open_and_login';
import {
  createInstanceType,
  openCreateInstanceTypePage,
} from '../../../../libs/test-utils/src/instance_types.page';
import { openInstanceTypesPage } from '../../../../libs/test-utils/src/main.page';

test('creates an instance type from Infrastructure', async ({ page }) => {
  // Allow login and page navigation to complete on a remote cluster.
  test.setTimeout(120_000);
  const instanceTypeName = process.env.OSAC_INSTANCE_TYPE_NAME ?? 'instance-type-e2e';

  // 1. Open the browser and log in.
  await openAndLoginWithEnvironment(page, '/');

  // 2. Open Infrastructure > Instance types and verify the Instance types page.
  await openInstanceTypesPage(page);

  // 3. Open the create page and verify its title.
  await openCreateInstanceTypePage(page);

  // 4. Fill and submit a GPU-enabled instance type.
  await createInstanceType(page, instanceTypeName, 'Instance type created by e2e test', 4, 16, {
    count: 1,
    resourceName: 'nvidia.com/A100',
    pciDeviceSelector: '10DE:20B0',
  });
});
