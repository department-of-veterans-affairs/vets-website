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
    {
      href: '/school-administrators/',
      label: 'Resources for schools',
    },
    {
      href:
        '/school-administrators/submit-yellow-ribbon-program-agreement-form-22-0839/',
      label: 'Submit a Yellow Ribbon Program agreement request',
    },
    ...(navigation.path.endsWith('/yellow-ribbon-instructions')
      ? [
          {
            href:
              '/school-administrators/submit-yellow-ribbon-program-agreement-form-22-0839/yellow-ribbon-instructions',
            label:
              'Instructions for completing Yellow Ribbon Program agreement',
          },
        ]
      : []),
  ];
  return (
    <div>
      <VaBreadcrumbs
        uswds
        breadcrumbList={crumbs}
        data-testid="breadcrumbs"
        wrapping
      />
    </div>
  );
};

export default Breadcrumbs;
