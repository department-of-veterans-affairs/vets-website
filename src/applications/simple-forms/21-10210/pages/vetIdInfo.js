import definitions from 'vets-json-schema/dist/definitions.json';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';

export default {
  uiSchema: {
    veteranSSN: ssnUI,
    veteranVaFileNumber: {
      'ui:title': 'VA file number (if applicable)',
      'ui:errorMessages': {
        pattern:
          "Please enter a valid VA file number.  All should have 7-9 digits; some may start with a 'C'",
      },
    },
    vaInsuranceFileNumber: {
      'ui:title': 'VA Insurance File Number (if applicable)',
    },
  },
  schema: {
    type: 'object',
    required: ['veteranSSN'],
    properties: {
      veteranSSN: definitions.ssn,
      veteranVaFileNumber: definitions.vaFileNumber,
      veteranVaInsuranceFileNumber: {
        type: 'string',
      },
    },
  },
};
