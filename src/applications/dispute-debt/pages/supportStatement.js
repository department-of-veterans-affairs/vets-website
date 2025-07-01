import VaTextareaField from 'platform/forms-system/src/js/web-component-fields/VaTextareaField';
import DebtTitle from '../components/DebtTitle';

const supportStatement = {
  uiSchema: {
    selectedDebts: {
      items: {
        'ui:title': DebtTitle,
        supportStatement: {
          'ui:title': `Tell us why you’re disputing this debt. Share any information you think will support your dispute.`,
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
