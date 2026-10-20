export type InstanceTypeLifecycleState = 'Unspecified' | 'Active' | 'Deprecated' | 'Obsolete';
export type InstanceTypeLifecycleAction = 'Deprecate' | 'Obsolete' | 'Reactivate';
export type InstanceTypeLifecycleMenuAction = InstanceTypeLifecycleAction | 'Delete';

export interface InstanceTypeLifecycleActionAvailability {
  canDeprecate: boolean;
  canObsolete: boolean;
  canReactivate: boolean;
  canDelete: boolean;
}

const actionsByState: Record<
  InstanceTypeLifecycleState,
  readonly InstanceTypeLifecycleMenuAction[]
> = {
  Unspecified: ['Deprecate', 'Obsolete', 'Reactivate'],
  Active: ['Deprecate', 'Obsolete'],
  Deprecated: ['Obsolete', 'Reactivate'],
  Obsolete: ['Deprecate', 'Reactivate', 'Delete'],
};

export const getInstanceTypeLifecycleActionAvailability = (
  state: InstanceTypeLifecycleState,
): InstanceTypeLifecycleActionAvailability => {
  const actions = actionsByState[state];

  return {
    canDeprecate: actions.includes('Deprecate'),
    canObsolete: actions.includes('Obsolete'),
    canReactivate: actions.includes('Reactivate'),
    canDelete: actions.includes('Delete'),
  };
};

export const getNextInstanceTypeLifecycleState = (
  action: InstanceTypeLifecycleAction,
): Exclude<InstanceTypeLifecycleState, 'Unspecified'> => {
  switch (action) {
    case 'Deprecate':
      return 'Deprecated';
    case 'Obsolete':
      return 'Obsolete';
    case 'Reactivate':
      return 'Active';
  }

  throw new Error('Unsupported instance type lifecycle action.');
};
