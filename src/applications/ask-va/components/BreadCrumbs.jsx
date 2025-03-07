import PropTypes from 'prop-types';
import React from 'react';
import { breadcrumbsDictionary } from '../constants';
import manifest from '../manifest.json';

const adjustLocation = currentLocation => {
  if (currentLocation.startsWith(`${manifest.rootUrl}/user/dashboard`)) {
    return '/user/dashboard';
  }
  if (currentLocation.startsWith('/response-sent')) {
    return '/response-sent';
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
