import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import SsnField from '../web-component-fields/ssn/SsnField';
import { validateSSN } from '../validation';
import SSNReviewWidget from '../review/SSNWidget';
import VaTextInputField from '../web-component-fields/VaTextInputField';

export const ssnUI = label => {
  return {
    'ui:title': label || 'Social Security number',
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

export const ssnSchema = () => ({
  ...commonDefinitions.ssn,
  required: true,
});

export const vaFileNumberUI = label => {
  return {
    'ui:title': label || 'VA file number (if you have one)',
    'ui:webComponentField': VaTextInputField,
    'ui:errorMessages': {
      pattern: 'Your VA file number must be 8 or 9 digits',
    },
    'ui:options': {
      hideEmptyValueInReview: true,
    },
  };
};

export const vaFileNumberSchema = () => commonDefinitions.vaFileNumber;

export const serviceNumberUI = label => {
  return {
    'ui:title': label || 'Service number (if applicable)',
    'ui:webComponentField': VaTextInputField,
    'ui:errorMessages': {
      pattern: 'Please enter a valid service number',
    },
    'ui:options': {
      hideEmptyValueInReview: true,
    },
  };
};

export const serviceNumberSchema = () => commonDefinitions.veteranServiceNumber;

// not sure about this
//
// export const ssnWithVaFileNumberPattern = options => {
//   return {
//     ssnUI: {
//       ...ssnUI(options.ssnLabel),
//       'ui:required': form => !form.vaFileNumber,
//     },
//     vaFileNumber: {
//       ...vaFileNumberUI(
//         'VA file number (must have this or a Social Security number)',
//       ),
//       'ui:required': form => !form.ssn,
//     },
//     ssnSchema: ssnSchema(),
//     vaFileNumberSchema: vaFileNumberSchema(),
//   };
// };
