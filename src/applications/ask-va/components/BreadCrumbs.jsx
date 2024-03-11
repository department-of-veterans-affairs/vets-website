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
    <va-breadcrumbs label="Breadcrumbs">
      {breadcrumbLinks.map(link => (
        <a href={link.href} key={link.key}>
          {link.title}
        </a>
      ))}
    </va-breadcrumbs>
  );
};

BreadCrumbs.propTypes = {
  currentLocation: PropTypes.string.isRequired,
};

export default BreadCrumbs;
