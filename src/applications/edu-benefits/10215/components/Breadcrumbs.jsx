import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import { useSelector } from 'react-redux';

const Breadcrumbs = () => {
  const navigation = useSelector(state => state.navigation.route);
  const crumbs = [
    {
      href: '/',
      label: 'Home',
    },
    ...(navigation.path === '/'
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
          ...(navigation.path.endsWith('/calculation-instructions')
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
      <VaBreadcrumbs uswds breadcrumbList={crumbs} data-testid="breadcrumbs" />
    </div>
  );
};

export default Breadcrumbs;
