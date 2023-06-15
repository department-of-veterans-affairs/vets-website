import definitions from 'vets-json-schema/dist/definitions.json';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';

/** @type {PageSchema} */
export default {
  uiSchema: {
    claimantSSN: ssnUI,
    claimantVaFileNumber: {
      'ui:title': 'VA file number (if available)',
      'ui:errorMessages': {
        pattern:
          "Please enter a valid VA file number.  All should have 7-9 digits; some may start with a 'C'",
      },
    },
    claimantVaInsuranceFileNumber: {
      'ui:title': 'VA Insurance File Number (if available)',
      'ui:errorMessages': {
        maxLength: 'Please enter a number with fewer than 20 digits.',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['claimantSSN'],
    properties: {
      claimantSSN: definitions.ssn,
      claimantVaFileNumber: definitions.vaFileNumber,
      claimantVaInsuranceFileNumber: {
        type: 'string',
        maxLength: 20,
      },
    },
  },
};
