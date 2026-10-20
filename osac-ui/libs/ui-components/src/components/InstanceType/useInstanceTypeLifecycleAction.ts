import type { TFunction } from 'i18next';

import { InstanceTypeState, InstanceTypes } from '@osac/types/private';
import { useUpdateResource } from '@osac/ui-components/api/use-resource';

import {
  type InstanceTypeLifecycleState,
  getInstanceTypeLifecycleActionAvailability,
} from './instanceTypeLifecycle';
import { useTranslation } from '../../hooks/useTranslation';
import { getErrorMessage } from '../../utils/error';
import { useToast } from '../Toast/useToast';

export type InstanceTypeLifecycleAction = Exclude<InstanceTypeState, InstanceTypeState.UNSPECIFIED>;

/** Determines which lifecycle transitions are valid from the instance type's current state. */
export const getInstanceTypeLifecycleActions = (state: InstanceTypeState | undefined) => {
  const stateLabel: InstanceTypeLifecycleState =
    state === InstanceTypeState.ACTIVE
      ? 'Active'
      : state === InstanceTypeState.DEPRECATED
        ? 'Deprecated'
        : state === InstanceTypeState.OBSOLETE
          ? 'Obsolete'
          : 'Unspecified';

  return getInstanceTypeLifecycleActionAvailability(stateLabel);
};

const getLifecycleErrorTitle = (t: TFunction, action: InstanceTypeLifecycleAction): string => {
  switch (action) {
    case InstanceTypeState.DEPRECATED:
      return t('Failed to deprecate instance type');
    case InstanceTypeState.OBSOLETE:
      return t('Failed to mark instance type as obsolete');
    case InstanceTypeState.ACTIVE:
      return t('Failed to reactivate instance type');
  }
};

/** Runs an instance type lifecycle transition and surfaces a toast if it fails. */
export const useInstanceTypeLifecycleAction = () => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const updateInstanceType = useUpdateResource(InstanceTypes);

  const runLifecycleAction = (instanceTypeId: string, action: InstanceTypeLifecycleAction) => {
    updateInstanceType.mutate(
      { object: { id: instanceTypeId, spec: { state: action } } },
      {
        onError: (error) => {
          addToast({
            variant: 'danger',
            title: getLifecycleErrorTitle(t, action),
            description: getErrorMessage(error),
          });
        },
      },
    );
  };

  return { runLifecycleAction };
};
