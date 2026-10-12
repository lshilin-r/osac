import { test } from '@playwright/test';

import { openAndLoginWithEnvironment } from '../../../../libs/test-utils/src/general/open_and_login';
import { openTenantsPage } from '../../../../libs/test-utils/src/main.page';
import { deleteTenant } from '../../../../libs/test-utils/src/tenants.page';

test('deletes the requested tenant', async ({ page }) => {
  // Allow the backend deletion and row disappearance wait to complete.
  test.setTimeout(120_000);

  const tenantName = process.env.OSAC_TENANT_NAME;
  if (!tenantName) {
    test.skip(true, 'OSAC_TENANT_NAME is not set.');
    return;
  }

  // 1. Open the browser and log in.
  await openAndLoginWithEnvironment(page, '/');

  // 2. Open the Tenants page and delete the tenant received as a parameter.
  await openTenantsPage(page);
  await deleteTenant(page, tenantName);
});
