import React from 'react';
import PropTypes from 'prop-types';

import {
  VaSelect,
  VaMemorableDate,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import constants from 'vets-json-schema/dist/constants.json';

import { scrollToFirstError } from 'platform/utilities/ui';

import { getPastDateError } from './utils';

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

export const PastDate = ({
  date,
  label,
  formSubmitted,
  missingErrorMessage,
  onChange,
}) => {
  const error = getPastDateError(date || '', missingErrorMessage);

  return (
    <VaMemorableDate
      name="endDate"
      label={label}
      error={formSubmitted ? error : null}
      monthSelect
      value={date}
      // use onDateBlur to ensure month & day are zero-padded
      onDateBlur={onChange}
      onDateChange={onChange}
      required
    />
  );
};

PastDate.propTypes = {
  date: PropTypes.string.isRequired,
  formSubmitted: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  missingErrorMessage: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export const scrollToError = () => {
  setTimeout(() => scrollToFirstError({ focusOnAlertRole: true }));
};
