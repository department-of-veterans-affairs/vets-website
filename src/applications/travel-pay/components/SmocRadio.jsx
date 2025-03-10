import React from 'react';
import PropTypes from 'prop-types';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function SmocRadio({
  label,
  value,
  name,
  children,
  onValueChange,
  error,
}) {
  const options = ['Yes', 'No'];
  return (
    <VaRadio
      id={name}
      onVaValueChange={onValueChange}
      value={value}
      data-testid={`${name}-test-id`}
      error={error ? 'You must make a selection to continue.' : null}
      label={label}
      label-header-level="1"
    >
      {children}
      {options.map(opt => (
        <va-radio-option
          label={opt}
          value={opt.toLowerCase()}
          key={`${name}-${opt.toLowerCase()}`}
          name={name}
          checked={value === opt.toLowerCase()}
        />
      ))}
    </VaRadio>
  );
}

SmocRadio.propTypes = {
  children: PropTypes.node,
  error: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  onValueChange: PropTypes.func,
};
