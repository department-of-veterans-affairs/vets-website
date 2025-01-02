import React from 'react';
import PropTypes from 'prop-types';
import Section from './Section';

const LabelValue = ({
  label,
  value,
  testId,
  actionName,
  ifEmpty = 'N/A',
  monospace = false,
  headerClass = 'vads-u-font-size--md vads-u-font-family--sans',
}) => {
  let displayValue = value;
  if (value === undefined || value === null || value === '') {
    displayValue = ifEmpty; // Default to a placeholder if the value is empty
  }

  return (
    <Section header={label} className={headerClass}>
      <p
        className={`${monospace ? 'monospace vads-u-line-height--6' : null}`}
        data-dd-privacy="mask"
        data-testid={testId}
        data-dd-action-name={actionName}
      >
        {displayValue}
      </p>
    </Section>
  );
};

LabelValue.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  actionName: PropTypes.string,
  headerClass: PropTypes.string,
  ifEmpty: PropTypes.string,
  monospace: PropTypes.bool,
  testId: PropTypes.string,
};

export default LabelValue;
