import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export const wrapWithBreadcrumb = component => (
  <>
    <div className="row">
      <VaBreadcrumbs
        uswds
        label="Breadcrumb"
        breadcrumbList={[
          { href: '/', label: 'Home' },
          {
            label: 'VA burial benefits and memorial items',
            href: '/burials-memorials',
          },
          {
            label: 'Apply for pre-need eligibility determination',
            href:
              'burials-memorials/pre-need/form-10007-apply-for-eligibility/introduction',
          },
        ]}
      />
    </div>
    {component}
  </>
);
