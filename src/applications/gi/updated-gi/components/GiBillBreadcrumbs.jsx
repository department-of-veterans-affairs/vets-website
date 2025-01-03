import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';

const GiBillBreadcrumbs = () => {
  const crumbs = [
    {
      href: '/',
      label: 'Home',
    },
    {
      href: '/education',
      label: 'Education and training',
    },
    {
      href: '/education/gi-bill-comparison-tool/',
      label: 'GI Bill® Comparison Tool',
    },
    {
      href: '/education/gi-bill-comparison-tool/schools-and-employers',
      label: 'Schools and employers',
    },
  ];
  return (
    <div className="gi-bill-container__bread-crumbs">
      <VaBreadcrumbs uswds breadcrumbList={crumbs} />
    </div>
  );
};

export default GiBillBreadcrumbs;
