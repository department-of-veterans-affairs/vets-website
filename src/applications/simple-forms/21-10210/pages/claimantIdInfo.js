export default {
  uiSchema: {
    claimantSSN: {
      'ui:title': 'Social Security number',
    },
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
      claimantSSN: {
        type: 'string',
      },
      vaFileNumber: {
        type: 'string',
      },
      vaInsuranceFileNumber: {
        type: 'string',
      },
    },
  },
};
