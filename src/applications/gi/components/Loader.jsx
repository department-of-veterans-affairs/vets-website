import React from 'react';
import PropTypes from 'prop-types';

const Loader = ({ className }) => (
  <div className={className}>
    <va-loading-indicator aria-hidden="true" />
  </div>
);

Loader.propTypes = {
  className: PropTypes.string,
};

export default Loader;
