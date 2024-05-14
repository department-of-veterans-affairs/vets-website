import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';

const BreadcrumbsV2 = () => (
  <VaBreadcrumbs
    label="Breadcrumbs"
    breadcrumbList={[
      {
        href: '/',
        label: 'Home',
      },
      {
        href: '/discharge-upgrade-instructions/introduction',
        label: 'Discharge upgrade',
      },
    ]}
  />
);

export default BreadcrumbsV2;
