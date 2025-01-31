import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';

const BreadcrumbsComponent = () => {
  const location = useLocation();
  const [pathname, setPathname] = React.useState(location.pathname);
  React.useEffect(() => {
    const handlePathnameChange = () => {
      setPathname(window.location.pathname);
    };
    window.addEventListener('popstate', handlePathnameChange);
    return () => {
      window.removeEventListener('popstate', handlePathnameChange);
    };
  }, []);
  const crumbs = [
    {
      href: '/',
      label: 'Home',
    },
    ...(pathname.endsWith('/10215/')
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

const Breadcrumbs = () => (
  <Router>
    <BreadcrumbsComponent />
  </Router>
);

export default Breadcrumbs;
