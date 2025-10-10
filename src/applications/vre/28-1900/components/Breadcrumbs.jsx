import React from 'react';
import { withRouter } from 'react-router';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';

const Breadcrumbs = ({ location }) => {
  const pathname = location?.pathname ?? '/';

  const crumbs = [
    { href: '/', label: 'VA.gov home' },
    { href: '/careers-employment', label: 'Careers and employment' },
    {
      href: '/careers-employment/vocational-rehabilitation',
      label: 'Veteran Readiness and Employment (Chapter 31)',
    },
  ];

  const isEligibility = pathname.startsWith('/your-eligibility-and-benefits');

  if (isEligibility) {
    crumbs.push({
      href:
        '/careers-employment/vocational-rehabilitation/apply-vre-form-28-1900/your-eligibility-and-benefits',
      label: 'Your eligibility and benefits',
    });
  } else {
    crumbs.push({
      href:
        '/careers-employment/vocational-rehabilitation/apply-vre-form-28-1900/introduction',
      label: 'Apply for Veteran Readiness and Employment Form 28-1900',
    });
  }

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

export default withRouter(Breadcrumbs);
