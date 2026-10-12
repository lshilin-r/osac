import { test } from '@playwright/test';

import { openAndLogin } from '../../../../libs/test-utils/src/general/open_and_login';
import { openTenantsPage } from '../../../../libs/test-utils/src/main.page';
import {
  createTenant,
  expectDefaultTenants,
  openCreateTenantPage,
} from '../../../../libs/test-utils/src/tenants.page';

test('creates a tenant from the Administration tenants page', async ({ page }) => {
  // Allow backend reconciliation and tenant deletion waits to complete.
  test.setTimeout(120_000);

  const username = process.env.OSAC_USERNAME;
  const password = process.env.OSAC_PASSWORD;
  if (!username || !password) {
    throw new Error('OSAC_USERNAME and OSAC_PASSWORD must be set to a valid test user.');
  }

  // 1. Open the browser and log in.
  await openAndLogin(page, '/', username, password);

  // 2. Open Administration > Tenants and verify the Tenants page.
  await openTenantsPage(page);

  // 3. Verify that the default tenants exist and are synced.
  await expectDefaultTenants(page);

  // 4. Open the tenant creation page and create tenant2.
  await openCreateTenantPage(page);
  await createTenant(page, 'tenant2');
});
