import { test } from '@playwright/test';

import { tenantNameOrSkip } from './test_data';
import { openAndLogin } from '../../../../libs/test-utils/src/general/open_and_login';
import { openTenantsPage } from '../../../../libs/test-utils/src/main.page';
import { deleteTenant } from '../../../../libs/test-utils/src/tenants.page';

test('deletes the requested tenant', async ({ page }) => {
  // Allow the 120-second backend deletion wait plus login and UI actions to complete.
  test.setTimeout(180_000);
  const configuredTenantName = tenantNameOrSkip();
  if (!configuredTenantName) {
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

  // 2. Open the Tenants page and delete the tenant received as a parameter.
  await openTenantsPage(page);
  await deleteTenant(page, configuredTenantName);
});
