import { expect, test } from '@playwright/test';
import { access } from 'node:fs/promises';

import { tenantNameOrSkip } from './test_data';
import { openAndLogin } from '../../../../libs/test-utils/src/general/open_and_login';
import { logProgress, testStep } from '../../../../libs/test-utils/src/general/test_progress';
import { openTenantsPage } from '../../../../libs/test-utils/src/main.page';
import {
  deleteTenant,
  tenantCredentialsFilePath,
} from '../../../../libs/test-utils/src/tenants.page';

test('deletes the requested tenant', async ({ page }) => {
  // Allow the 120-second backend deletion wait plus login and UI actions to complete.
  test.setTimeout(180_000);
  const configuredTenantName = tenantNameOrSkip();
  if (!configuredTenantName) {
    logProgress('tenant-delete', 'Skipped: tenant_name is not configured.');
    return;
  }
  logProgress('tenant-delete', `Starting flow for "${configuredTenantName}".`);

  await testStep('tenant-delete', 'Log in as the admin test user', async () => {
    await openAndLogin(
      page,
      '/',
      process.env.OSAC_ADMIN_USERNAME ?? '',
      process.env.OSAC_ADMIN_PASSWORD ?? '',
      'admin',
    );
  });

  await testStep('tenant-delete', 'Open Administration > Tenants', async () => {
    await openTenantsPage(page);
  });

  await testStep('tenant-delete', `Delete tenant "${configuredTenantName}"`, async () => {
    const credentialsFile = tenantCredentialsFilePath(configuredTenantName);
    await expect(access(credentialsFile)).resolves.toBeUndefined();
    await deleteTenant(page, configuredTenantName);
    await expect(access(credentialsFile)).rejects.toThrow();
  });
});
