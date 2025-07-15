import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const BCList = [
  {
    href: '/representative',
    label: 'VA.gov/representative home',
  },

  {
    href: '/representative/accreditation/attorney-claims-agent-form-21a',
    label: 'Apply to become a VA accredited attorney or claims agent',
  },
];

export const wrapWithBreadcrumb = component => (
  <>
    <div className="row">
      <VaBreadcrumbs
        uswds
        label="Breadcrumbs"
        data-testid="breadcrumbs"
        breadcrumbList={BCList}
        home-veterans-affairs={false}
      />
    </div>
    {component}
  </>
);
