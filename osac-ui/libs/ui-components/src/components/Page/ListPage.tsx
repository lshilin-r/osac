import * as React from 'react';
import { Content, Flex, FlexItem, PageSection, Stack, Title } from '@patternfly/react-core';

type ListPageProps = {
  title: string;
  titleTestId?: string;
  description?: string;
  descriptionTestId?: string;
  actions?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  error?: unknown;
  children: React.ReactNode;
};

const ListPage: React.FC<ListPageProps> = ({
  title,
  titleTestId,
  description,
  descriptionTestId,
  actions,
  breadcrumb,
  error,
  children,
}) => (
  <PageSection hasBodyWrapper={false}>
    <Stack>
      <Flex
        gap={{ default: 'gapMd' }}
        alignItems={{ default: breadcrumb ? 'alignItemsFlexStart' : 'alignItemsCenter' }}
        justifyContent={{ default: 'justifyContentSpaceBetween' }}
      >
        <FlexItem>
          <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
            {breadcrumb ? <FlexItem>{breadcrumb}</FlexItem> : null}
            <FlexItem>
              <Title headingLevel="h1" size="3xl" data-testid={titleTestId}>
                {title}
              </Title>
              {description && (
                <Content component="p" data-testid={descriptionTestId}>
                  {description}
                </Content>
              )}
            </FlexItem>
          </Flex>
        </FlexItem>
        {actions && !error ? <FlexItem>{actions}</FlexItem> : null}
      </Flex>
    </Stack>
    {children}
  </PageSection>
);

export default ListPage;
