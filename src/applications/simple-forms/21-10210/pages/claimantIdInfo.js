import definitions from 'vets-json-schema/dist/definitions.json';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';

export default {
  uiSchema: {
    claimantSSN: ssnUI,
    vaFileNumber: {
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
    required: ['claimantSSN'],
    properties: {
      claimantSSN: definitions.ssn,
      vaFileNumber: definitions.vaFileNumber,
      vaInsuranceFileNumber: {
        type: 'string',
      },
    },
  },
};
