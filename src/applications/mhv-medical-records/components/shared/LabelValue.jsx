import React from 'react';
import PropTypes from 'prop-types';
import Section from './Section';

const LabelValue = ({
  label,
  value,
  children,
  testId,
  actionName,
  ifEmpty = 'N/A',
  monospace = false,
  headerClass = 'vads-u-font-size--md vads-u-font-family--sans',
}) => {
  let displayValue = children || value; // Prefer children if provided
  if (!children && (value === undefined || value === null || value === '')) {
    displayValue = ifEmpty; // Default to a placeholder if both value and children are empty
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
  actionName: PropTypes.string,
  children: PropTypes.node,
  headerClass: PropTypes.string,
  ifEmpty: PropTypes.string,
  monospace: PropTypes.bool,
  testId: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default LabelValue;
