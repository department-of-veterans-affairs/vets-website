import React, { useEffect } from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from 'platform/utilities/ui';

const Breadcrumbs = () => {
  useEffect(() => {
    focusElement('#search-breadcrumbs');
  }, []);

  return (
    <div className="row">
      <VaBreadcrumbs
        class="vads-u-margin-left--1p5"
        id="search-breadcrumbs"
        label="Breadcrumbs"
        breadcrumbList={[
          {
            href: '/',
            label: 'Home',
          },
          {
            href: '/search',
            label: 'Search VA.gov',
          },
        ]}
      />
    </div>
  );
};

export default Breadcrumbs;
