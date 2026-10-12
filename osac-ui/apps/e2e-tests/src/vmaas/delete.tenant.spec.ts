import { test } from '@playwright/test';

import { openAndLogin } from '../../../../libs/test-utils/src/general/open_and_login';
import { openTenantsPage } from '../../../../libs/test-utils/src/main.page';
import { deleteTenant } from '../../../../libs/test-utils/src/tenants.page';

test('deletes the requested tenant', async ({ page }) => {
  // Allow the backend deletion and row disappearance wait to complete.
  test.setTimeout(120_000);

  const username = process.env.OSAC_USERNAME;
  const password = process.env.OSAC_PASSWORD;
  const tenantName = process.env.OSAC_TENANT_NAME;
  if (!username || !password) {
    throw new Error('OSAC_USERNAME and OSAC_PASSWORD must be set to a valid test user.');
  }
  if (!tenantName) {
    throw new Error('OSAC_TENANT_NAME must be set to the tenant that should be deleted.');
  }

  // 1. Open the browser and log in.
  await openAndLogin(page, '/', username, password);

  // 2. Open the Tenants page and delete the tenant received as a parameter.
  await openTenantsPage(page);
  await deleteTenant(page, tenantName);
});
