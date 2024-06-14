import React from 'react';
import PropTypes from 'prop-types';
import { states } from '@department-of-veterans-affairs/platform-forms/address';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const StateSelect = props => {
  const { id, onChange, value } = props;

  const handleChange = event => {
    const selectedValue = event.target.value;
    onChange(selectedValue);
  };

  return (
    <VaSelect id={id} name={id} value={value} onVaSelect={handleChange} uswds>
      {states.USA.map(state => (
        <option key={state.value} value={state.value}>
          {state.label}
        </option>
      ))}
    </VaSelect>
  );
};

StateSelect.propTypes = {
  id: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
};

export default StateSelect;
