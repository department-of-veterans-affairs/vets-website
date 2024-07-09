import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import React from 'react';
import { breadcrumbsDictionary } from '../constants';

const adjustLocation = currentLocation => {
  if (currentLocation.startsWith('/contact-us/ask-va-too/user/dashboard')) {
    return '/user/dashboard';
  }
  if (currentLocation.startsWith('/introduction')) {
    return '/introduction';
  }
  return '/newInquiry';
};

const BreadCrumbs = ({ currentLocation }) => {
  const adjustedLocation = adjustLocation(currentLocation);
  const breadcrumbLinks = breadcrumbsDictionary[adjustedLocation];

  return (
    <VaBreadcrumbs
      home-veterans-affairs={false}
      label="Breadcrumbs"
      breadcrumbList={[...breadcrumbLinks]}
      uswds
    />
  );
};

BreadCrumbs.propTypes = {
  currentLocation: PropTypes.string.isRequired,
};

export default BreadCrumbs;
