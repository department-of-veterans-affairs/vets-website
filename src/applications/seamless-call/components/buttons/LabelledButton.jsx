import PropTypes from 'prop-types';
import React from 'react';

const LabelledButton = ({ children, label }) => {
  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column items-center gap--1">
      {children}
      <div>{label}</div>
    </div>
  );
};

LabelledButton.propTypes = {
  label: PropTypes.string.isRequired,
};

export default LabelledButton;
