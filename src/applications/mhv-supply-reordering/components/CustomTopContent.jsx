import React from 'react';
import PropTypes from 'prop-types';
import Breadcrumbs from './Breadcrumbs';

const CustomTopContent = ({ currentLocation }) => {
  if (
    currentLocation?.pathname.includes('confirmation') ||
    currentLocation?.pathname.includes('introduction')
  ) {
    return <Breadcrumbs />;
  }
  return null;
};

CustomTopContent.propTypes = {
  currentLocation: PropTypes.object.isRequired,
};

export default CustomTopContent;
