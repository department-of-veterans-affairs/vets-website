import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import SsnField from '../web-component-fields/SsnField';
import { validateSSN } from '../validation';
import SSNReviewWidget from '../review/SSNWidget';
import VaTextInputField from '../web-component-fields/VaTextInputField';

/**
 * @param {string | UISchemaOptions} [options]
 * @returns {UISchemaOptions}
 */
export const ssnUI = options => {
  const opts = typeof options === 'string' ? { 'ui:title': options } : options;

  return {
    'ui:title': 'Social Security number',
    'ui:webComponentField': SsnField,
    'ui:reviewWidget': SSNReviewWidget,
    'ui:validations': [validateSSN],
    'ui:errorMessages': {
      pattern:
        'Please enter a valid 9 digit Social Security number (dashes allowed)',
      required: 'Please enter a Social Security number',
    },
    ...opts,
  };
};

/**
 * @param {SchemaOptions} [options]
 * @returns {SchemaOptions}
 */
export const ssnSchema = options => {
  return options
    ? { ...commonDefinitions.ssn, ...options }
    : commonDefinitions.ssn;
};

/**
 * @param {string | UISchemaOptions} [options]
 * @returns {UISchemaOptions}
 */
export const vaFileNumberUI = options => {
  const opts = typeof options === 'string' ? { 'ui:title': options } : options;

  return {
    'ui:title': 'VA file number (if applicable)',
    'ui:webComponentField': VaTextInputField,
    'ui:errorMessages': {
      pattern: 'Your VA file number must be 8 or 9 digits',
    },
    'ui:options': {
      hideEmptyValueInReview: true,
    },
    ...opts,
  };
};

/**
 * @param {SchemaOptions} [options]
 * @returns {SchemaOptions}
 */
export const vaFileNumberSchema = options => {
  return options
    ? { ...commonDefinitions.vaFileNumber, ...options }
    : commonDefinitions.vaFileNumber;
};

/**
 * @param {string | UISchemaOptions} [options]
 * @returns {UISchemaOptions}
 */
export const serviceNumberUI = options => {
  const opts = typeof options === 'string' ? { 'ui:title': options } : options;

  return {
    'ui:title': 'Service number (if applicable)',
    'ui:webComponentField': VaTextInputField,
    'ui:errorMessages': {
      pattern:
        'Your Veteran Service Number must start with 0, 1, or 2 letters followed by 5 to 8 digits',
    },
    'ui:options': {
      hideEmptyValueInReview: true,
    },
    ...opts,
  };
};

/**
 * @param {SchemaOptions} [options]
 * @returns {SchemaOptions}
 */
export const serviceNumberSchema = options => {
  return options
    ? { ...commonDefinitions.veteranServiceNumber, ...options }
    : commonDefinitions.veteranServiceNumber;
};
