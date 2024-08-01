import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import React from 'react';

const Breadcrumbs = (
  <VaBreadcrumbs
    className="breadcrumbs-container"
    breadcrumbList={[
      {
        href: '/',
        label: 'Home',
      },
      {
        href: '/mock-form-minimal-header',
        label: 'Mock form minimal header',
      },
    ]}
    label="Breadcrumb"
    homeVeteransAffairs={false}
  />
);

export const CustomTopContent = ({ currentLocation }) => {
  if (
    currentLocation?.pathname.includes('confirmation') ||
    currentLocation?.pathname.includes('introduction')
  ) {
    return <>{Breadcrumbs}</>;
  }
  return null;
};

CustomTopContent.propTypes = {
  currentLocation: PropTypes.object,
};
