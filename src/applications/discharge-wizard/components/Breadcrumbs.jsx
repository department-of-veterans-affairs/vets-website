import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';

const Breadcrumbs = () => (
  <VaBreadcrumbs
    class="vads-u-padding--0"
    label="Breadcrumbs"
    uswds
    breadcrumbList={[
      {
        href: '/',
        label: 'Home',
      },
      {
        href: '/discharge-upgrade-instructions',
        label: 'How to apply for a discharge upgrade',
      },
    ]}
  />
);

export default Breadcrumbs;
