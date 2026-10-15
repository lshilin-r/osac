import { test } from '@playwright/test';

import { openAndLoginWithEnvironment } from '../../../../libs/test-utils/src/general/open_and_login';
import { deleteInstanceType } from '../../../../libs/test-utils/src/instance_types.page';
import { openInstanceTypesPage } from '../../../../libs/test-utils/src/main.page';

test('deletes the requested obsolete instance type', async ({ page }) => {
  test.setTimeout(120_000);

  const instanceTypeName = process.env.OSAC_INSTANCE_TYPE_NAME ?? 'instance-type-e2e';

  // 1. Open the browser and log in.
  await openAndLoginWithEnvironment(page, '/');

  // 2. Open Infrastructure > Instance types and delete the requested instance type.
  await openInstanceTypesPage(page);
  await deleteInstanceType(page, instanceTypeName);
});
