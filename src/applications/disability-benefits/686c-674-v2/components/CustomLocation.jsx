import React, { useState } from 'react';
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
  errorSchema,
}) {
  const [outsideUsa, setOutsideUsa] = useState(formData?.outsideUsa ?? false);
  const [city, setCity] = useState(formData?.location?.city ?? '');
  const [state, setState] = useState(formData?.location?.state ?? '');
  const [cityError, setCityError] = useState(null);
  const [stateError, setStateError] = useState(null);

  const customLabel = !checkboxLabel?.length
    ? 'This occurred outside the U.S.'
    : checkboxLabel;

  const stateErr = errorSchema?.location?.state?.__errors?.[0];
  const cityErr = errorSchema?.location?.city?.__errors?.[0];

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
      setStateError(stateErr || 'State is required');
    } else {
      setStateError(null);
    }
    onBlur();
  };

  const handleCityBlur = () => {
    if (!city && (outsideUsa === false || outsideUsa === undefined)) {
      setCityError(cityErr || 'City is required');
    } else if (city && !validateText(city)) {
      setCityError('Enter a valid city name');
    } else {
      setCityError(null);
    }
    onBlur();
  };

  return (
    <>
      <VaCheckbox
        id="outside-usa"
        name="outside-usa"
        label={customLabel}
        onVaChange={handleCheckboxChange}
        aria-describedby={customLabel}
        checked={outsideUsa}
        uswds
      />
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

// import React, { useState, useEffect } from 'react';
// import constants from 'vets-json-schema/dist/constants.json';
// import {
//   VaTextInput,
//   VaSelect,
//   VaCheckbox,
// } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

// const MILITARY_STATE_VALUES = constants.militaryStates.map(
//   state => state.value,
// );
// const filteredStates = constants.states.USA.filter(
//   state => !MILITARY_STATE_VALUES.includes(state.value),
// );

// const STATE_VALUES = filteredStates.map(state => state.value);
// const STATE_NAMES = filteredStates.map(state => state.label);

// export default function CustomLocation({
//   checkboxLabel,
//   onChange,
//   formData,
//   onBlur,
//   errorSchema,
// }) {
//   const [outsideUsa, setOutsideUsa] = useState(formData?.outsideUsa ?? false);
//   const [city, setCity] = useState(formData?.location?.city ?? '');
//   const [state, setState] = useState(formData?.location?.state ?? '');
//   const [cityError, setCityError] = useState(null);
//   const [stateError, setStateError] = useState(null);

//   const customLabel = !checkboxLabel?.length
//     ? 'This occurred outside the U.S.'
//     : checkboxLabel;

//   const stateErr = errorSchema?.location?.state?.__errors;
//   const cityErr = errorSchema?.location?.city?.__errors;
//   console.log({ errorSchema });

//   const handleCheckboxChange = event => {
//     const isChecked = event.target.checked;
//     setOutsideUsa(isChecked);
//     setState(isChecked ? undefined : state);
//     setStateError(null);
//     onChange({
//       outsideUsa: isChecked,
//       location: { city, state: isChecked ? undefined : state },
//     });
//   };

//   const handleSelect = e => {
//     e.preventDefault();
//     setState(e.target.value);
//     onChange({ outsideUsa, location: { city, state: e.target.value } });
//   };

//   const handleTextInput = e => {
//     e.preventDefault();
//     setCity(e.target.value);
//     onChange({ outsideUsa, location: { city: e.target.value, state } });
//   };

//   const validateText = text => {
//     const textPattern = /^[A-Za-z\s-]+$/;
//     return textPattern.test(text);
//   };

//   const handleStateBlur = () => {
//     if (!outsideUsa && !state) {
//       setStateError(stateErr);
//     } else {
//       setStateError(null);
//     }
//     onBlur();
//   };

//   const handleCityBlur = () => {
//     if (city === '' && (outsideUsa === false || outsideUsa === undefined)) {
//       setCityError(cityErr);
//     } else if (city && !validateText(city)) {
//       setCityError('Enter a valid city name');
//     } else {
//       setCityError(null);
//     }
//     onBlur();
//   };

//   // useEffect(
//   //   () => {
//   //     if (city && !validateText(city)) {
//   //       setCityError('Enter a valid city name');
//   //     } else {
//   //       setCityError(null);
//   //     }
//   //   },
//   //   [city],
//   // );

//   return (
//     <>
//       {/* schema property name: outsideUsa */}
//       <VaCheckbox
//         id="outside-usa"
//         name="outside-usa"
//         label={customLabel}
//         onVaChange={handleCheckboxChange}
//         aria-describedby={customLabel}
//         checked={outsideUsa}
//         uswds
//       />
//       {/* schema property name: location.city */}
//       <VaTextInput
//         label="City"
//         aria-describedby="City"
//         id="city"
//         name="city"
//         onInput={handleTextInput}
//         // onBlur={handleCityBlur}
//         value={city}
//         required
//         uswds
//         autocomplete
//         maxLength={50}
//         type="text"
//         error={cityErr}
//       />
//       {/* schema property name: location.state */}
//       <VaSelect
//         label="State"
//         inert={outsideUsa}
//         required={!outsideUsa}
//         uswds
//         value={state}
//         error={stateErr}
//         onVaSelect={handleSelect}
//         onKeyDown={handleSelect}
//         // onBlur={handleStateBlur}
//       >
//         {STATE_NAMES.map((name, index) => (
//           <option key={name} value={STATE_VALUES[index]}>
//             {name}
//           </option>
//         ))}
//       </VaSelect>
//     </>
//   );
// }

// /* eslint-disable no-console */
// import React from 'react';
// import { useSelector } from 'react-redux';
// import constants from 'vets-json-schema/dist/constants.json';
// import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';

// const MILITARY_STATE_VALUES = constants.militaryStates.map(
//   ({ value }) => value,
// );
// const filteredStates = constants.states.USA.filter(
//   state => !MILITARY_STATE_VALUES.includes(state.value),
// );

// export function CustomSelect(props) {
//   const outsideUsa = useSelector(
//     state =>
//       state?.form?.data?.deaths?.[Number(props.index)]?.dependentDeathLocation
//         ?.outsideUsa ?? false,
//   );

//   console.log({ outsideUsa });
//   console.log({ props });

//   return (
//     <VaSelectField
//       {...props}
//       required={!outsideUsa}
//       uiOptions={{ ...props.uiOptions, inert: outsideUsa }}
//     />
//   );
// }
