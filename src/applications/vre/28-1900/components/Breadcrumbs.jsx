import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import { useSelector } from 'react-redux';

const Breadcrumbs = () => {
  const navigation = useSelector(
    state => state.navigation?.route || { path: '' },
  );

  const crumbs = [
    { href: '/', label: 'Home' },
    {
      href: '/careers-employment/',
      label: 'Employment and training',
    },
    {
      href: '/careers-employment/vocational-rehabilitation/',
      label: 'Veteran Readiness and Employment (Chapter 31)',
    },
    ...(navigation.path?.endsWith('/check-eligibility-and-apply')
      ? [
          {
            href:
              '/careers-employment/vocational-rehabilitation/check-eligibility-and-apply',
            label: 'Check Your Eligibility and Apply',
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
