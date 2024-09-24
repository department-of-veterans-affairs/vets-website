import React, { useState, useEffect } from 'react';
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

export default function CustomLocation({
  checkboxLabel,
  onChange,
  formData,
  onBlur,
}) {
  const [outsideUsa, setOutsideUsa] = useState(formData?.outsideUsa ?? false);
  const [city, setCity] = useState(formData?.location?.city ?? '');
  const [state, setState] = useState(formData?.location?.state ?? '');
  const [cityError, setCityError] = useState(null);
  const [stateError, setStateError] = useState(null);

  const handleCheckboxChange = event => {
    const isChecked = event.target.checked;
    setOutsideUsa(isChecked);
    setState(isChecked ? undefined : state);
    setStateError(null);
    onChange({
      outsideUsa: isChecked,
      location: { city, state: isChecked ? undefined : state },
    });
  };

  const handleSelect = e => {
    e.preventDefault();
    setState(e.target.value);
    onChange({ outsideUsa, location: { city, state: e.target.value } });
  };

  const handleTextInput = e => {
    e.preventDefault();
    setCity(e.target.value);
    onChange({ outsideUsa, location: { city: e.target.value, state } });
  };

  const validateText = text => {
    const textPattern = /^[A-Za-z\s-]+$/;
    return textPattern.test(text);
  };

  const handleStateBlur = () => {
    if (!outsideUsa && !state) {
      setStateError('Select a state');
    } else {
      setStateError(null);
    }
    onBlur();
  };

  const handleCityBlur = () => {
    if (city === '' && (outsideUsa === false || outsideUsa === undefined)) {
      setCityError('Enter a city name');
    } else if (city && !validateText(city)) {
      setCityError('Enter a valid city name');
    } else {
      setCityError(null);
    }
    onBlur();
  };

  useEffect(
    () => {
      if (city && !validateText(city)) {
        setCityError('Enter a valid city name');
      } else {
        setCityError(null);
      }
    },
    [city],
  );

  return (
    <>
      {/* schema property name: outsideUsa */}
      <VaCheckbox
        id="outside-usa"
        name="outside-usa"
        label={checkboxLabel}
        onVaChange={handleCheckboxChange}
        aria-describedby={checkboxLabel}
        checked={outsideUsa}
        uswds
      />
      {/* schema property name: location.city */}
      <VaTextInput
        label="City"
        aria-describedby="City"
        id="city"
        name="city"
        onInput={handleTextInput}
        onBlur={handleCityBlur}
        value={city}
        required
        uswds
        autocomplete
        maxLength={50}
        type="text"
        error={cityError}
      />
      {/* schema property name: location.state */}
      <VaSelect
        label="State"
        inert={outsideUsa}
        required={!outsideUsa}
        uswds
        value={state}
        error={stateError}
        onVaSelect={handleSelect}
        onKeyDown={handleSelect}
        onBlur={handleStateBlur}
      >
        {STATE_NAMES.map((name, index) => (
          <option key={name} value={STATE_VALUES[index]}>
            {name}
          </option>
        ))}
      </VaSelect>
    </>
  );
}
