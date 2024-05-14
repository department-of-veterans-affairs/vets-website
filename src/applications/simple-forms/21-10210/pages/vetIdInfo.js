import definitions from 'vets-json-schema/dist/definitions.json';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';

/** @type {PageSchema} */
export default {
  uiSchema: {
    veteranSSN: ssnUI,
    veteranVaFileNumber: {
      'ui:title': 'VA file number (if available)',
      'ui:errorMessages': {
        pattern: 'Your VA file number must be 8 or 9 digits',
      },
    },
    veteranVaInsuranceFileNumber: {
      'ui:title': 'VA Insurance File number (if available)',
      'ui:errorMessages': {
        maxLength: 'Please enter a number with fewer than 20 digits.',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['veteranSSN'],
    properties: {
      veteranSSN: definitions.ssn,
      veteranVaFileNumber: definitions.centralMailVaFile,
      veteranVaInsuranceFileNumber: {
        type: 'string',
        maxLength: 20,
      },
    },
  },
};
