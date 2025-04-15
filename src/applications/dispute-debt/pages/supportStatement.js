import VaTextareaField from 'platform/forms-system/src/js/web-component-fields/VaTextareaField';

const supportStatement = {
  uiSchema: {
    selectedDebts: {
      items: {
        'ui:title': 'Need Debt X of Y: Name of debt',
        supportStatement: {
          'ui:title': `Tell us why you're disputing this debt: `,
          'ui:webComponentField': VaTextareaField,
          'ui:required': () => true,
          'ui:errorMessages': {
            required: 'Please provide a response',
          },
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      selectedDebts: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            supportStatement: {
              type: 'string',
            },
          },
          required: ['supportStatement'],
        },
      },
    },
  },
};

export default supportStatement;
