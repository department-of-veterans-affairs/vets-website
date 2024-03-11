import React from 'react';
import PropTypes from 'prop-types';

const Loader = ({ className }) => (
  <div className={className}>
    <va-loading-indicator label="Loading" set-focus />
  </div>
);

Loader.propTypes = {
  className: PropTypes.string,
};
export default Loader;
