import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';

const Breadcrumbs = () => {
  return (
    <VaBreadcrumbs
      class="income-limits-breadcrumbs vads-u-margin-left--1"
      label="Breadcrumbs"
      currentPageRedirect
      breadcrumbList={[
        {
          href: '/',
          label: 'Home',
        },
        {
          href: '/health-care',
          label: 'VA Health care',
        },
        {
          href: '/health-care/income-limits',
          label: 'Income limits and your VA health care',
        },
      ]}
    />
  );
};

export default Breadcrumbs;
