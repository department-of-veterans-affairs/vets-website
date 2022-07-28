import React from 'react';
import PropTypes from 'prop-types';

const ReapplyTextLink = ({
  onClick,
  linkLabel = 'Reapply for VA health care',
}) => (
  <button
    type="button"
    className="va-button-link schemaform-start-button"
    onClick={onClick}
  >
    {linkLabel}
  </button>
);

ReapplyTextLink.propTypes = {
  linkLabel: PropTypes.string,
  onClick: PropTypes.func,
};

export default ReapplyTextLink;
