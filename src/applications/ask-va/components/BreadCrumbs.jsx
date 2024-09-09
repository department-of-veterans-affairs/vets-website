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
  return '/newQuestion';
};

const BreadCrumbs = ({ currentLocation }) => {
  const adjustedLocation = adjustLocation(currentLocation);
  const breadcrumbLinks = breadcrumbsDictionary[adjustedLocation];
  const bcString = JSON.stringify(breadcrumbLinks);

  return (
    <div className="row">
      <div className="usa-width-two-thirds medium-8 columns">
        <va-breadcrumbs
          label="Breadcrumbs"
          breadcrumb-list={bcString}
          data-testid="Breadcrumb"
        />
      </div>
    </div>
  );
};

BreadCrumbs.propTypes = {
  currentLocation: PropTypes.string.isRequired,
};

export default BreadCrumbs;
