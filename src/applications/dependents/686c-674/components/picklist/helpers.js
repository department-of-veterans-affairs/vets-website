import React from 'react';
import PropTypes from 'prop-types';

import {
  VaSelect,
  VaMemorableDate,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import constants from 'vets-json-schema/dist/constants.json';

import { scrollToFirstError } from 'platform/utilities/ui';

import { getPastDateError } from './utils';

/**
 * typeDef GetValueResult
 * @type {object}
 * @property {string} field - The name of the field
 * @property {any} value - The value of the field
 */
/**
 * Get value from web component event
 * @param {CustomEvent} event - web component event
 * @returns {GetValueResult} - Object with field name and value
 */
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

/**
 * State select component
 * @param {string} name - name attribute
 * @param {string} label - label text
 * @param {function} onChange - onChange handler
 * @param {string} error - error message
 * @param {string} value - selected value
 * @returns {React.ReactElement} State select component
 */
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

const countriesMinusUSA = constants.countries.filter(
  country => country.value !== 'USA',
);

/**
 * Country select component (excludes USA)
 * @param {string} name - name attribute
 * @param {string} label - label text
 * @param {function} onChange - onChange handler
 * @param {string} error - error message
 * @param {string} value - selected value
 * @returns {React.ReactElement} Country select component
 */
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
    {countriesMinusUSA.map(country => (
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

/**
 * Past memorable date component
 * @param {string} date - date string in YYYY-MM-DD format
 * @param {string} label - label text
 * @param {boolean} formSubmitted - whether the form has been submitted
 * @param {string} missingErrorMessage - error message for missing date
 * @param {function} onChange - onChange handler
 * @returns {React.ReactElement} Past date component
 */
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

/**
 * Additional info component with info about removing a dependent parent for
 * reasons other than death
 * @returns {React.ReactElement} - Additional info component
 */
export const RemoveParentAdditionalInfo = () => (
  <va-additional-info trigger="How can I remove a dependent parent for reasons other than death?">
    <p>
      You can only use this form to remove a dependent parent if they died. If
      your parent is still living and you want to remove them as a dependent,
      call us at <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
      <va-telephone contact={CONTACTS['711']} tty />
      ).
    </p>
  </va-additional-info>
);

/**
 * Scroll to the first error on the page after a short delay
 * @returns {void}
 */
export const scrollToError = () => {
  // focusOnAlertRole settings will set focus on the span with role="alert"
  // inside the web component shadow DOM
  setTimeout(() => scrollToFirstError({ focusOnAlertRole: true }));
};
