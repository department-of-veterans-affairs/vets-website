import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { states } from '@department-of-veterans-affairs/platform-forms/address';
import PropTypes from 'prop-types';
import React from 'react';

export default function StateSelect({ id, onChange, value }) {
  const handleChange = event => {
    const selectedValue = event.target.value;
    onChange(selectedValue);
  };

  return (
    <VaSelect id={id} name={id} value={value} onVaSelect={handleChange}>
      {states.USA.map(state => (
        <option key={state.value} value={state.value}>
          {state.label}
        </option>
      ))}
    </VaSelect>
  );
}

StateSelect.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};
