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
            label: 'Get Help From An Accredited Representative',
            href: '/get-help-from-accredited-representative',
          },
          {
            label: 'Appoint An Accredited Representative',
            href: '/get-help-from-accredited-representative/appoint',
          },
        ]}
      />
    </div>
    {component}
  </>
);
