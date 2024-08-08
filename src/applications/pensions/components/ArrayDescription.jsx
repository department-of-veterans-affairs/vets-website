import React from 'react';
import PropTypes from 'prop-types';

const ArrayDescription = ({ message }) => (
  <span className="schemaform-block-title schemaform-block-subtitle vads-u-display--block vads-u-padding-top--6 vads-u-padding-bottom--0p5">
    {message}
  </span>
);

ArrayDescription.propTypes = {
  message: PropTypes.string.isRequired,
};

export default ArrayDescription;
