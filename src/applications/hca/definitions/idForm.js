import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';

// define ID form schema
export const idFormSchema = {
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
      minLength: 1,
      maxLength: 25,
      pattern: '^.*\\S.*',
    },
    middleName: {
      type: 'string',
      maxLength: 30,
    },
    lastName: {
      type: 'string',
      minLength: 2,
      maxLength: 35,
      pattern: '^.*\\S.*',
    },
    suffix: {
      type: 'string',
      enum: ['Jr.', 'Sr.', 'II', 'III', 'IV'],
    },
    dob: {
      type: 'string',
      format: 'date',
    },
    ssn: {
      type: 'string',
      pattern: '^[0-9]{9}$',
    },
  },
  required: ['firstName', 'lastName', 'dob', 'ssn'],
};

// define ID form UI schema
export const idFormUiSchema = {
  firstName: {
    'ui:title': 'First name',
    'ui:errorMessages': {
      required: 'Please enter a first name.',
      pattern: 'Please enter a first name.',
    },
  },
  middleName: {
    'ui:title': 'Middle name',
  },
  lastName: {
    'ui:title': 'Last name',
    'ui:errorMessages': {
      required: 'Please enter a last name.',
      pattern: 'Please enter a last name.',
    },
  },
  suffix: {
    'ui:title': 'Suffix',
    'ui:options': {
      widgetClassNames: 'form-select-medium',
    },
  },
  dob: {
    ...currentOrPastDateUI('Date of birth'),
    'ui:errorMessages': {
      required:
        'Please provide your date of birth. Select the month and day, then enter your birth year.',
    },
  },
  ssn: {
    ...ssnUI,
    'ui:errorMessages': {
      required: 'Please enter a Social Security number',
      // NOTE: this `pattern` message is ignored because the pattern
      // validation error message is hard coded in the validation function:
      // https://github.com/usds/us-forms-system/blob/db029cb4f18362870d420e3eee5b71be98004e5e/src/js/validation.js#L231
      pattern:
        'Please enter a Social Security number in this format: XXX-XX-XXXX.',
    },
  },
};
