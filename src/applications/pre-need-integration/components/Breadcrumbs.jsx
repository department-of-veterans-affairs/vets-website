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
            label: 'Burials and memorials',
            href: '/burials-memorials',
          },
          {
            label: 'Pre-need eligibility for burial in a VA cemetery',
            href: '/burials-memorials/pre-need-eligibility',
          },
          {
            label: 'Apply for pre-need eligibility determination',
            href:
              'burials-memorials/pre-need-eligibility/apply-for-eligibility-form-40-10007/introduction',
          },
        ]}
      />
    </div>
    {component}
  </>
);
