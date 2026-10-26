import { test } from '@playwright/test';

import { instanceTypeNameOrSkip, instanceTypeTestData } from './test_data';
import { openAndLogin } from '../../../../libs/test-utils/src/general/open_and_login';
import {
  deleteInstanceType,
  ensureInstanceTypeExists,
} from '../../../../libs/test-utils/src/instance_types.page';
import { openInstanceTypesPage } from '../../../../libs/test-utils/src/main.page';

test('deletes the requested instance type', async ({ page }) => {
  test.setTimeout(120_000);
  const instanceTypeName = instanceTypeNameOrSkip();
  if (!instanceTypeName) {
    return;
  }

  // 1. Open the browser and log in.
  await openAndLogin(
    page,
    '/',
    process.env.OSAC_ADMIN_USERNAME ?? '',
    process.env.OSAC_ADMIN_PASSWORD ?? '',
    'admin',
  );

  // 2. Open Infrastructure > Instance types and delete the requested instance type.
  await openInstanceTypesPage(page);
  await ensureInstanceTypeExists(
    page,
    instanceTypeName,
    instanceTypeTestData.description,
    instanceTypeTestData.vcpus,
    instanceTypeTestData.memoryGib,
    instanceTypeTestData.gpu,
  );
  await deleteInstanceType(page, instanceTypeName);
});
