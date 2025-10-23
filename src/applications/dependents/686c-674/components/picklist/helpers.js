import React from 'react';
import PropTypes from 'prop-types';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import constants from 'vets-json-schema/dist/constants.json';

export const getValue = event => {
  const field = event.target.name;
  switch (event.target.tagName) {
    case 'VA-RADIO':
    case 'VA-SELECT':
    case 'VA-TEXT-INPUT':
      return { field, value: event.detail.value };
    case 'VA-CHECKBOX':
      return { field, value: event.detail.checked };
    default:
      return { field, value: event.target.value };
  }
};

export const SelectState = ({ name, label, onChange, error, value }) => (
  <VaSelect
    class="vads-u-margin-top--4"
    name={name}
    label={label}
    value={value}
    onVaSelect={onChange}
    error={error}
    required
  >
    {constants.states.USA.map(state => (
      <option key={state.value} value={state.value}>
        {state.label}
      </option>
    ))}
  </VaSelect>
);

SelectState.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  value: PropTypes.string,
};

export const SelectCountry = ({ name, label, onChange, error, value }) => (
  <VaSelect
    class="vads-u-margin-top--4"
    name={name}
    label={label}
    value={value}
    onVaSelect={onChange}
    error={error}
    required
  >
    {constants.countries.map(country => (
      <option key={country.value} value={country.value}>
        {country.label}
      </option>
    ))}
  </VaSelect>
);

SelectCountry.propTypes = {
  label: PropTypes.string.isRequired,

  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  value: PropTypes.string,
};
