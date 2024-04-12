import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';

const BreadcrumbsV2 = () => (
  <VaBreadcrumbs
    class="vads-u-margin-left--1p5"
    label="Breadcrumbs"
    uswds
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
