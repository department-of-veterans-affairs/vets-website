import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

// component: React.Component
// breadcrumbs: {href: '/foo', label: 'Bar'}[]
// https://design.va.gov/storybook/?path=/docs/uswds-va-breadcrumbs--docs
export const wrapWithBreadcrumb = (component, breadcrumbs) => (
  <>
    <div className="row vads-u-padding-x--1p5">
      {breadcrumbs && <VaBreadcrumbs uswds breadcrumbList={breadcrumbs} />}
    </div>
    {component}
  </>
);
