import {
  instanceTypeFieldIds,
  instanceTypeTestIds,
} from '../ui-components/src/components/InstanceType/testIds';

type InstanceTypesLocator =
  | readonly [
      role: 'link' | 'button' | 'heading' | 'textbox' | 'grid' | 'menuitem',
      options: { name: string; exact: true },
    ]
  | readonly [label: string];

const testId = (value: string): readonly [string] => [`[data-testid="${value}"]`];
const id = (value: string): readonly [string] => [`#${value}`];

export const InstanceTypesMainPage = {
  pageTitle: testId(instanceTypeTestIds.listPageTitle),
  createInstanceType: testId(instanceTypeTestIds.listCreateButton),
  instanceTypesTable: testId(instanceTypeTestIds.table),
  instanceTypeRows: testId(instanceTypeTestIds.row),
  instanceTypeNameCell: testId(instanceTypeTestIds.nameCell),
  instanceTypeLifecycleCell: testId(instanceTypeTestIds.lifecycleCell),
  instanceTypeVcpusCell: testId(instanceTypeTestIds.vcpusCell),
  instanceTypeMemoryGibCell: testId(instanceTypeTestIds.memoryGibCell),
  instanceTypeGpusCell: testId(instanceTypeTestIds.gpusCell),
  instanceTypeActionsToggle: testId(instanceTypeTestIds.actionsToggle),
  emptyStateTitle: ['heading', { name: 'No instance types yet.', exact: true }],
} as const satisfies Record<string, InstanceTypesLocator>;

export const InstanceTypesActionsMenu = {
  deprecate: ['menuitem', { name: 'Deprecate', exact: true }],
  obsolete: ['menuitem', { name: 'Obsolete', exact: true }],
  reactivate: ['menuitem', { name: 'Reactivate', exact: true }],
  delete: ['menuitem', { name: 'Delete', exact: true }],
} as const satisfies Record<string, InstanceTypesLocator>;

export const InstanceTypesCreatePage = {
  pageTitle: testId(instanceTypeTestIds.createPageTitle),
  instanceTypesBreadcrumb: ['button', { name: 'Instance types', exact: true }],
  name: id(instanceTypeFieldIds.name),
  description: id(instanceTypeFieldIds.description),
  vcpus: id(instanceTypeFieldIds.vcpus),
  vcpusPlus: [
    `.pf-v6-c-number-input:has(#${instanceTypeFieldIds.vcpus}) button[aria-label="Plus"]`,
  ],
  memoryGib: id(instanceTypeFieldIds.memoryGib),
  memoryGibPlus: [
    `.pf-v6-c-number-input:has(#${instanceTypeFieldIds.memoryGib}) button[aria-label="Plus"]`,
  ],
  gpuCount: id(instanceTypeFieldIds.gpuCount),
  gpuCountPlus: [
    `.pf-v6-c-number-input:has(#${instanceTypeFieldIds.gpuCount}) button[aria-label="Plus"]`,
  ],
  gpuResourceName: id(instanceTypeFieldIds.gpuResourceName),
  gpuPciDeviceSelector: id(instanceTypeFieldIds.gpuPciDeviceSelector),
  create: testId(instanceTypeTestIds.createButton),
  cancel: testId(instanceTypeTestIds.cancelButton),
} as const satisfies Record<string, InstanceTypesLocator>;

export const InstanceTypesDetailPage = {
  instanceTypesBreadcrumb: ['button', { name: 'Instance types', exact: true }],
  pageTitle: testId(instanceTypeTestIds.detailPageTitle),
  description: testId(instanceTypeTestIds.detailDescription),
  detailsCard: testId(instanceTypeTestIds.detailsCard),
  gpuCard: testId(instanceTypeTestIds.gpuCard),
  detailsGroups: ['.pf-v6-c-description-list__group'],
  detailValue: ['.pf-v6-c-description-list__description'],
  noGpuMessage: ['This instance type has no GPU attached.'],
} as const satisfies Record<string, InstanceTypesLocator>;

export const InstanceTypesDeletePage = {
  deleteDialog: ['[role="dialog"][aria-labelledby="delete-confirm-title"]'],
  deleteTitle: ['#delete-confirm-title'],
  deleteWarning: ['This permanently deletes the instance type. This action cannot be undone.'],
  deleteButton: ['button', { name: 'Delete', exact: true }],
} as const satisfies Record<string, InstanceTypesLocator>;
