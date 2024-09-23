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

export default function CustomLocation({ checkboxLabel, onChange }) {
  // const dispatch = useDispatch();
  // const formData = useSelector(state => state.form.data);

  const [inert, setInert] = useState(false);

  const handleCheckboxChange = event => {
    setInert(event.target.checked);
    onChange();
  };

  // 1. onChange of any of these should POST current data to /v0/in_progress_forms/686C-674-V2
  // action: SET_AUTO_SAVE_FORM_STATUS
  // 2. reset VaSelect to undefined upon going inert
  // 3. hook up formData props to all

  return (
    <>
      {/* property name: outsideUsa */}
      <VaCheckbox
        id="outside-usa"
        name="outside-usa"
        label={checkboxLabel}
        onVaChange={handleCheckboxChange}
        aria-describedby={checkboxLabel}
        uswds
      />
      {/* property name: location.city */}
      <VaTextInput
        label="City"
        aria-describedby="City"
        id="city"
        name="city"
        required
        uswds
      />
      {/* property name: location.state */}
      <VaSelect label="State" inert={inert} required={!inert} uswds>
        {STATE_NAMES.map((name, index) => (
          <option key={name} value={STATE_VALUES[index]}>
            {name}
          </option>
        ))}
      </VaSelect>
    </>
  );
}
