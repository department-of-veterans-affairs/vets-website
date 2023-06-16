import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import SsnField from '../web-component-fields/SsnField';
import { validateSSN } from '../validation';
import SSNReviewWidget from '../review/SSNWidget';
import VaTextInputField from '../web-component-fields/VaTextInputField';

const SSN_DEFAULT_TITLE = 'Social Security number';
const VA_FILE_NUMBER_DEFAULT_TITLE = 'VA file number (if applicable)';
const SERVICE_NUMBER_DEFAULT_TITLE = 'Service number (if applicable)';

/**
 * Web component uiSchema for SSN
 * @param {string} [title]
 * @returns {UISchemaOptions}
 */
const ssnUI = title => {
  return {
    'ui:title': title ?? SSN_DEFAULT_TITLE,
    'ui:webComponentField': SsnField,
    'ui:reviewWidget': SSNReviewWidget,
    'ui:validations': [validateSSN],
    'ui:errorMessages': {
      pattern:
        'Please enter a valid 9 digit Social Security number (dashes allowed)',
      required: 'Please enter a Social Security number',
    },
  };
};

/**
 * @returns `commonDefinitions.ssn`
 */
const ssnSchema = commonDefinitions.ssn;

/**
 * @param {string} [title]
 * @returns {UISchemaOptions}
 */
const vaFileNumberUI = title => {
  return {
    'ui:title': title ?? VA_FILE_NUMBER_DEFAULT_TITLE,
    'ui:webComponentField': VaTextInputField,
    'ui:errorMessages': {
      pattern: 'Your VA file number must be 8 or 9 digits',
    },
    'ui:options': {
      hideEmptyValueInReview: true,
    },
  };
};

/**
 * @returns `commonDefinitions.vaFileNumber`
 */
const vaFileNumberSchema = commonDefinitions.vaFileNumber;

/**
 * @param {string} [title]
 * @returns {UISchemaOptions}
 */
const serviceNumberUI = title => {
  return {
    'ui:title': title ?? SERVICE_NUMBER_DEFAULT_TITLE,
    'ui:webComponentField': VaTextInputField,
    'ui:errorMessages': {
      pattern:
        'Your Veteran Service Number must start with 0, 1, or 2 letters followed by 5 to 8 digits',
    },
    'ui:options': {
      hideEmptyValueInReview: true,
    },
  };
};

/**
 * @returns `commonDefinitions.veteranServiceNumber`
 */
const serviceNumberSchema = commonDefinitions.veteranServiceNumber;

/**
 */
const ssnOrVaFileNumberUI = () => ({
  socialSecurityNumber: ssnUI(),
  vaFileNumber: vaFileNumberUI(),
});

/**
 *
 */
const ssnOrVaFileNumberOrServiceNumberUI = () => ({
  socialSecurityNumber: ssnUI(),
  vaFileNumber: vaFileNumberUI(),
  serviceNumber: serviceNumberUI(),
});

const ssnOrVaFileNumberSchema = {
  socialSecurityNumber: ssnSchema,
  vaFileNumber: vaFileNumberSchema,
};

const ssnOrVaFileNumberOrServiceNumberSchema = {
  socialSecurityNumber: ssnSchema,
  vaFileNumber: vaFileNumberSchema,
  serviceNumber: serviceNumberSchema,
};

export {
  ssnUI,
  ssnSchema,
  vaFileNumberUI,
  vaFileNumberSchema,
  serviceNumberUI,
  serviceNumberSchema,
  ssnOrVaFileNumberUI,
  ssnOrVaFileNumberOrServiceNumberUI,
  ssnOrVaFileNumberSchema,
  ssnOrVaFileNumberOrServiceNumberSchema,
};
