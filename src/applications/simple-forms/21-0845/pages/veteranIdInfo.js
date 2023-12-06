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
    veteranServiceNumber: {
      'ui:title': 'Service number (if available)',
      'ui:errorMessages': {
        pattern:
          'Please enter a valid Service number, with 0-2 upper-case letters followed by 5-8 digits.',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['veteranSSN'],
    properties: {
      veteranSSN: definitions.ssn,
      veteranVaFileNumber: definitions.centralMailVaFile,
      veteranServiceNumber: definitions.veteranServiceNumber,
    },
  },
};
