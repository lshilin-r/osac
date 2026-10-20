import { InstanceTypes } from '@osac/types/private';
import { useListResource } from '@osac/ui-components/api/use-resource';
import CreateButton from '@osac/ui-components/components/Primitives/CreateButton.tsx';

import AdminInstanceTypeTable from './AdminInstanceTypeTable';
import { instanceTypeTestIds } from './testIds';
import { useTranslation } from '../../hooks/useTranslation';
import ListPage from '../Page/ListPage';
import ListPageBody from '../Page/ListPageBody';

const AdminInstanceTypeListPage = () => {
  const { t } = useTranslation();
  const { data, isLoading, error } = useListResource(InstanceTypes);

  return (
    <ListPage
      title={t('Instance types')}
      titleTestId={instanceTypeTestIds.listPageTitle}
      description={t('Manage provider-defined instance types for this cloud platform.')}
      error={error}
      actions={
        <CreateButton
          to="/admin/infrastructure/instance-types/create"
          data-testid={instanceTypeTestIds.listCreateButton}
        >
          {t('Create instance type')}
        </CreateButton>
      }
    >
      <ListPageBody isLoading={isLoading} error={error}>
        <AdminInstanceTypeTable instanceTypes={data?.items || []} />
      </ListPageBody>
    </ListPage>
  );
};

export default AdminInstanceTypeListPage;
