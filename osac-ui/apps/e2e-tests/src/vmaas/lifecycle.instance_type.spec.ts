import { test } from '@playwright/test';

import { openAndLoginWithEnvironment } from '../../../../libs/test-utils/src/general/open_and_login';
import {
  type InstanceTypeLifecycleAction,
  changeInstanceTypeLifecycle,
} from '../../../../libs/test-utils/src/instance_types.page';
import { openInstanceTypesPage } from '../../../../libs/test-utils/src/main.page';

test('deprecates and obsoletes the requested instance type', async ({ page }) => {
  test.setTimeout(120_000);

  const instanceTypeName = process.env.OSAC_INSTANCE_TYPE_NAME ?? 'instance-type-e2e';

  // 1. Open the browser and log in.
  await openAndLoginWithEnvironment(page, '/');

  // 2. Open Infrastructure > Instance types.
  await openInstanceTypesPage(page);

  // 3. Deprecate the instance type and verify the Deprecated action menu.
  const deprecate: InstanceTypeLifecycleAction = 'Deprecate';
  await changeInstanceTypeLifecycle(page, instanceTypeName, deprecate);

  // 4. Obsolete the instance type and verify the Obsolete action menu.
  const obsolete: InstanceTypeLifecycleAction = 'Obsolete';
  await changeInstanceTypeLifecycle(page, instanceTypeName, obsolete);
});
