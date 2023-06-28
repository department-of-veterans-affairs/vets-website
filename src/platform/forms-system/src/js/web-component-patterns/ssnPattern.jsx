import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import SsnField from '../web-component-fields/SsnField';
import { validateSSN } from '../validation';
import SSNReviewWidget from '../review/SSNWidget';
import VaTextInputField from '../web-component-fields/VaTextInputField';

const SSN_DEFAULT_TITLE = 'Social Security number';
const VA_FILE_NUMBER_DEFAULT_TITLE = 'VA file number (if applicable)';

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
 */
const ssnOrVaFileNumberUI = () => ({
  socialSecurityNumber: ssnUI(),
  vaFileNumber: vaFileNumberUI(),
});

const ssnOrVaFileNumberSchema = {
  socialSecurityNumber: ssnSchema,
  vaFileNumber: vaFileNumberSchema,
};

export {
  ssnUI,
  ssnSchema,
  vaFileNumberUI,
  vaFileNumberSchema,
  ssnOrVaFileNumberUI,
  ssnOrVaFileNumberSchema,
};
