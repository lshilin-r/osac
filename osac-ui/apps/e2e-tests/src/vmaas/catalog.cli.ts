import { expect } from '@playwright/test';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export const catalogItemResource = 'computeinstancecatalogitems';

export interface CatalogItem {
  description?: string;
  metadata?: {
    name?: string;
  };
  template?: {
    id?: string;
  };
  title?: string;
}

export interface OsacCommandResult {
  exitCode: number;
  stderr: string;
  stdout: string;
}

const cliPath = process.env.OSAC_CLI_PATH ?? 'osac';

const cliPrefix = process.env.OSAC_CLI_CONFIG ? ['--config', process.env.OSAC_CLI_CONFIG] : [];

export const runOsacCommand = async (args: readonly string[]): Promise<OsacCommandResult> => {
  try {
    const result = await execFileAsync(cliPath, [...cliPrefix, ...args], {
      env: { ...process.env, NO_COLOR: '1' },
      maxBuffer: 1024 * 1024,
      timeout: 120_000,
    });

    return { exitCode: 0, stderr: result.stderr, stdout: result.stdout };
  } catch (error: unknown) {
    const commandError = error as NodeJS.ErrnoException & {
      stderr?: string;
      stdout?: string;
    };

    if (commandError.code === 'ENOENT') {
      throw new Error(
        `Unable to run the osac CLI '${cliPath}'. Set OSAC_CLI_PATH to an installed CLI binary.`,
      );
    }

    return {
      exitCode: typeof commandError.code === 'number' ? commandError.code : 1,
      stderr: commandError.stderr ?? commandError.message,
      stdout: commandError.stdout ?? '',
    };
  }
};

export const expectOsacCommandSucceeded = (
  result: OsacCommandResult,
  description: string,
): void => {
  expect(
    result.exitCode,
    `${description} failed.\nstdout: ${result.stdout}\nstderr: ${result.stderr}`,
  ).toBe(0);
};

export const getCatalogItems = async (name: string): Promise<CatalogItem[]> => {
  const result = await runOsacCommand(['get', catalogItemResource, name, '--output', 'json']);
  expectOsacCommandSucceeded(result, `Get catalog item '${name}'`);

  const parsed: unknown = JSON.parse(result.stdout);
  if (Array.isArray(parsed)) {
    return parsed as CatalogItem[];
  }
  if (parsed !== null && typeof parsed === 'object') {
    return [parsed as CatalogItem];
  }

  throw new Error(
    `The CLI returned an unexpected JSON response while getting catalog item '${name}'.`,
  );
};

export const getCatalogTestConfiguration = ():
  | {
      description: string;
      name: string;
      template: string;
      title: string;
    }
  | undefined => {
  const name = process.env.OSAC_CATALOG_ITEM_NAME;
  const template = process.env.OSAC_COMPUTE_INSTANCE_TEMPLATE;
  if (!name || !template) {
    return undefined;
  }

  return {
    description:
      process.env.OSAC_CATALOG_ITEM_DESCRIPTION ?? 'CLI-created catalog item for E2E testing.',
    name,
    template,
    title: process.env.OSAC_CATALOG_ITEM_TITLE ?? 'CLI catalog item',
  };
};
