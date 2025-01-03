import React from 'react';
import PropTypes from 'prop-types';
import HeaderSection from './HeaderSection';

const LabelValue = ({
  label,
  value,
  children,
  testId,
  actionName,
  ifEmpty = 'N/A',
  monospace = false,
  headerClass = 'vads-u-margin-top--2 vads-u-margin-bottom--0 vads-u-font-size--md vads-u-font-family--sans',
}) => {
  let displayValue = children || value; // Prefer children if provided
  if (!children && (value === undefined || value === null || value === '')) {
    displayValue = ifEmpty; // Default to a placeholder if both value and children are empty
  }

  return (
    <HeaderSection header={label} className={headerClass}>
      <p
        style={{ whiteSpace: 'pre-line' }}
        className={`vads-u-margin-y--0 ${
          monospace ? 'monospace vads-u-line-height--6' : null
        }`}
        data-dd-privacy="mask"
        data-testid={testId}
        data-dd-action-name={actionName}
      >
        {displayValue}
      </p>
    </HeaderSection>
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
