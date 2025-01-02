import React from 'react';
import PropTypes from 'prop-types';

const LabelValue = ({ label, value, testId, actionName, ifEmpty = 'N/A' }) => {
  let displayValue = value;
  if (value === undefined || value === null || value === '') {
    displayValue = ifEmpty; // Default to a placeholder if the value is empty
  }

  return (
    <>
      <h3 className="vads-u-font-size--md vads-u-font-family--sans">{label}</h3>
      <p
        data-dd-privacy="mask"
        data-testid={testId}
        data-dd-action-name={actionName}
      >
        {displayValue}
      </p>
    </>
  );
};

LabelValue.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  actionName: PropTypes.string,
  ifEmpty: PropTypes.string,
  testId: PropTypes.string,
};

export default LabelValue;
