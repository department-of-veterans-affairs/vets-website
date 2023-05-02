import definitions from 'vets-json-schema/dist/definitions.json';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';

export default {
  uiSchema: {
    claimantSSN: ssnUI,
    vaFileNumber: {
      'ui:title': 'VA file number (if applicable)',
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
      vaFileNumber: {
        type: 'string',
      },
      vaInsuranceFileNumber: {
        type: 'string',
      },
    },
  },
};
