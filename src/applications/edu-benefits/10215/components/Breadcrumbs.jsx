import React from 'react';
import PropTypes from 'prop-types';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';

const Breadcrumbs = ({ pathname }) => {
  const crumbs = [
    {
      href: '/',
      label: 'Home',
    },
    ...(pathname === '/'
      ? [
          {
            href: '/find-forms/',
            label: 'Find VA Form',
          },
          {
            href: '/education/apply-for-education-benefits/application/10215/',
            label: 'About VA Form 22-10215',
          },
        ]
      : [
          {
            href: '/school-administrators/',
            label: 'Resources for schools',
          },
          {
            href:
              '/education/apply-for-education-benefits/application/10215/introduction/',
            label: 'Report 85/15 Rule enrollment ratios',
          },
          ...(pathname.endsWith('/calculation-instructions')
            ? [
                {
                  href:
                    '/education/apply-for-education-benefits/application/10215/calculation-instructions',
                  label: 'Calculation instructions',
                },
              ]
            : []),
        ]),
  ];
  return (
    <div className="row">
      <VaBreadcrumbs uswds breadcrumbList={crumbs} />
    </div>
  );
};
Breadcrumbs.propTypes = {
  pathname: PropTypes.string.isRequired,
};

export default Breadcrumbs;
