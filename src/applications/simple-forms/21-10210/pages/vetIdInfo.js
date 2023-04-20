export default {
  uiSchema: {
    veteranSSN: {
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
    required: ['veteranSSN'],
    properties: {
      veteranSSN: {
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
