import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';

const Breadcrumbs = () => {
  return (
    <VaBreadcrumbs
      class="income-limits-breadcrumbs vads-u-margin-left--1"
      label="Breadcrumbs"
      uswds
      breadcrumbList={[
        {
          href: '/',
          label: 'Home',
        },
        {
          href: '/health-care',
          label: 'Health Care',
        },
        {
          href: '/health-care/income-limits',
          label: 'Check income limits',
        },
      ]}
    />
  );
};

export default Breadcrumbs;
