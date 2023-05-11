import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import SsnField from '../web-component-fields/SsnField';
import { validateSSN } from '../validation';
import SSNReviewWidget from '../review/SSNWidget';
import VaTextInputField from '../web-component-fields/VaTextInputField';

const SSN_DEFAULT_TITLE = 'Social Security number';
const VA_FILE_NUMBER_DEFAULT_TITLE = 'VA file number (if applicable)';
const SERVICE_NUMBER_DEFAULT_TITLE = 'Service number (if applicable)';
const SSN_DEFAULT_INLINE_TITLE = 'Social Security number';
const VA_FILE_NUMBER_DEFAULT_INLINE_TITLE = 'VA file number (if applicable)';
const SERVICE_NUMBER_DEFAULT_INLINE_TITLE = 'service number (if applicable)';

/**
 * @param {string} [title]
 * @param {UIOptions} [options]
 * @returns {UIOptions}
 */
export const ssnUI = (title, uiOptions) => {
  return {
    'ui:title': title || SSN_DEFAULT_TITLE,
    'ui:webComponentField': SsnField,
    'ui:reviewWidget': SSNReviewWidget,
    'ui:validations': [validateSSN],
    'ui:errorMessages': {
      pattern:
        'Please enter a valid 9 digit Social Security number (dashes allowed)',
      required: 'Please enter a Social Security number',
    },
    'ui:options': {
      ...uiOptions,
    },
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
 * @param {string} [title]
 * @param {UIOptions} [options]
 * @returns {UIOptions}
 */
export const vaFileNumberUI = (title, uiOptions) => {
  return {
    'ui:title': title || VA_FILE_NUMBER_DEFAULT_TITLE,
    'ui:webComponentField': VaTextInputField,
    'ui:errorMessages': {
      pattern: 'Your VA file number must be 8 or 9 digits',
    },
    'ui:options': {
      hideEmptyValueInReview: true,
      ...uiOptions,
    },
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
 * @param {string} [title]
 * @param {UIOptions} [options]
 * @returns {UISchemaOptions}
 */
export const serviceNumberUI = (title, uiOptions) => {
  return {
    'ui:title': title || SERVICE_NUMBER_DEFAULT_TITLE,
    'ui:webComponentField': VaTextInputField,
    'ui:errorMessages': {
      pattern:
        'Your Veteran Service Number must start with 0, 1, or 2 letters followed by 5 to 8 digits',
    },
    'ui:options': {
      hideEmptyValueInReview: true,
      ...uiOptions,
    },
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

/**
 * @param {(defaultTitle: string, key: string) => string} [formatTitle] - an optional callback with two parameters to format the title. The first parameter is the defaultTitle to be formatted. The second parameter is the key of the field `socialSecurityNumber` or `vaFileNumber`. The callback should return a string of the title.
 *  @param {UIOptions} [uiOptions] - 'ui:options' properties applied to all fields
 */
export const ssnOrVaFileNumberUI = (formatTitle, uiOptions) => ({
  socialSecurityNumber: ssnUI(
    formatTitle
      ? formatTitle(SSN_DEFAULT_INLINE_TITLE, 'socialSecurityNumber')
      : null,
    uiOptions,
  ),
  vaFileNumber: formatTitle
    ? vaFileNumberUI(
        formatTitle(VA_FILE_NUMBER_DEFAULT_INLINE_TITLE, 'vaFileNumber'),
      )
    : null,
  uiOptions,
});

/**
 * @param {(defaultTitle: string, key: string) => string} [formatTitle] - an optional callback with two parameters to format the title. The first parameter is the defaultTitle to be formatted. The second parameter is the key of the field `socialSecurityNumber` or `vaFileNumber` or `serviceNumber`. The callback should return a string of the title.
 * @param {UIOptions} [uiOptions]
 */
export const ssnOrVaFileNumberOrServiceNumberUI = (formatTitle, uiOptions) => ({
  socialSecurityNumber: ssnUI(
    formatTitle
      ? formatTitle(SSN_DEFAULT_INLINE_TITLE, 'socialSecurityNumber')
      : null,
    uiOptions,
  ),
  vaFileNumber: vaFileNumberUI(
    formatTitle
      ? formatTitle(VA_FILE_NUMBER_DEFAULT_INLINE_TITLE, 'vaFileNumber')
      : null,
    uiOptions,
  ),
  serviceNumber: serviceNumberUI(
    formatTitle
      ? formatTitle(SERVICE_NUMBER_DEFAULT_INLINE_TITLE, 'serviceNumber')
      : null,
    uiOptions,
  ),
});
