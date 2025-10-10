import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';

const Breadcrumbs = () => {
  const crumbs = [
    { href: '/', label: 'VA.gov home' },
    { href: '/careers-employment', label: 'Careers and employment' },
    {
      href: '/careers-employment/your-vre-eligibility/',
      label: 'Your VR&E eligibility and benefits',
    },
  ];

  return (
    <div className="row">
      <div className="usa-width-two-thirds desktop-lg:vads-u-padding-left--0 vads-u-padding-left--2">
        <VaBreadcrumbs
          uswds
          wrapping
          breadcrumbList={crumbs}
          data-testid="breadcrumbs"
        />
      </div>
    </div>
  );
};

export default Breadcrumbs;
