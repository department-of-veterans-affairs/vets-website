import React, { useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
import constants from 'vets-json-schema/dist/constants.json';
import {
  VaTextInput,
  VaSelect,
  VaCheckbox,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const MILITARY_STATE_VALUES = constants.militaryStates.map(
  state => state.value,
);
const filteredStates = constants.states.USA.filter(
  state => !MILITARY_STATE_VALUES.includes(state.value),
);

const STATE_VALUES = filteredStates.map(state => state.value);
const STATE_NAMES = filteredStates.map(state => state.label);

export default function CustomLocation({ checkboxLabel }) {
  // const dispatch = useDispatch();
  // const formData = useSelector(state => state.form.data);

  const [inert, setInert] = useState(false);

  const handleCheckboxChange = event => {
    setInert(event.target.checked);
  };

  return (
    <>
      <VaCheckbox
        id="outside-usa"
        name="outside-usa"
        label={checkboxLabel}
        onVaChange={handleCheckboxChange}
        aria-describedby={checkboxLabel}
        uswds
      />
      <VaTextInput
        label="City"
        aria-describedby="City"
        id="city"
        name="city"
        required
        uswds
      />
      <VaSelect label="State" inert={inert} required={!inert}>
        {STATE_NAMES.map((name, index) => (
          <option key={name} value={STATE_VALUES[index]}>
            {name}
          </option>
        ))}
      </VaSelect>
    </>
  );
}
