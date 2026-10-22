import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

import type {
  InstanceTypeGpu,
  InstanceTypeLifecycleAction,
} from '../../../../libs/test-utils/src/instance_types.page';

interface RawInstanceTypeGpu {
  count: number;
  resource_name: string;
  pci_device_selector: string;
}

interface RawInstanceType {
  name: string;
  description: string;
  vcpus: number;
  memory_gib: number;
  gpu?: RawInstanceTypeGpu;
  lifecycle_actions: InstanceTypeLifecycleAction[];
}

interface RawExtravars {
  catalog_status: string;
  catalog_type: string;
  catalog_usage: string;
  catalog_item_description: string;
  catalog_item_name: string;
  catalog_item_title: string;
  compute_instance_template: string;
  instance_type: RawInstanceType;
}

export interface CatalogTestData {
  description: string;
  name: string;
  status: string;
  template: string;
  title: string;
  type: string;
  usage: string;
}

export interface InstanceTypeTestData {
  name: string;
  description: string;
  vcpus: number;
  memoryGib: number;
  gpu?: InstanceTypeGpu;
  lifecycleActions: InstanceTypeLifecycleAction[];
}

const extravarsPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../extravars.yaml',
);

const rawExtravars = parse(readFileSync(extravarsPath, 'utf8')) as RawExtravars;

const { instance_type: rawInstanceType } = rawExtravars;

export const catalogTestData: CatalogTestData = {
  description: rawExtravars.catalog_item_description,
  name: rawExtravars.catalog_item_name,
  status: rawExtravars.catalog_status,
  template: rawExtravars.compute_instance_template,
  title: rawExtravars.catalog_item_title,
  type: rawExtravars.catalog_type,
  usage: rawExtravars.catalog_usage,
};

export const instanceTypeTestData: InstanceTypeTestData = {
  name: rawInstanceType.name,
  description: rawInstanceType.description,
  vcpus: rawInstanceType.vcpus,
  memoryGib: rawInstanceType.memory_gib,
  gpu: rawInstanceType.gpu
    ? {
        count: rawInstanceType.gpu.count,
        resourceName: rawInstanceType.gpu.resource_name,
        pciDeviceSelector: rawInstanceType.gpu.pci_device_selector,
      }
    : undefined,
  lifecycleActions: rawInstanceType.lifecycle_actions,
};
