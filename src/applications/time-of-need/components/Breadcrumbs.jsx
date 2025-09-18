import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export const wrapWithBreadcrumb = (component, location) => {
  const pathname = location?.pathname;
  return (
    <>
      <div className="row">
        <VaBreadcrumbs
          uswds
          label="Breadcrumb"
          breadcrumbList={[
            { href: '/', label: 'Home' },
            { href: '/burials-memorials', label: 'Burials and memorials' },
            {
              href: '/burials-memorials/national-cemetery-burial',
              label: 'Burial in a national cemetery',
            },
            {
              href: pathname || '#',
              label: 'Apply for burial benefits',
            },
          ]}
        />
      </div>
      {component}
    </>
  );
};
