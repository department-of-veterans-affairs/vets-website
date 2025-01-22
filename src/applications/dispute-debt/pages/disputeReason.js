import VaRadioField from 'platform/forms-system/src/js/web-component-fields/VaRadioField';

const EXISTENCE = `I don't think I owe this debt to VA`;
const AMOUNT = `I don’t think the amount is correct on this debt`;

const disputeReason = {
  uiSchema: {
    selectedDebts: {
      items: {
        'ui:title': 'Need Debt X of Y: Name of debt',
        disputeReason: {
          'ui:title': 'Select the reason you’re disputing this debt.',
          'ui:webComponentField': VaRadioField,
          'ui:required': () => true,
          'ui:options': {
            labels: {
              // eslint-disable-next-line object-shorthand
              EXISTENCE: EXISTENCE,
              // eslint-disable-next-line object-shorthand
              AMOUNT: AMOUNT,
            },
          },
          'ui:errorMessages': {
            required: 'Please select a reason for disputing this debt',
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
            disputeReason: {
              type: 'string',
              enum: [EXISTENCE, AMOUNT],
            },
          },
          required: ['disputeReason'],
        },
      },
    },
  },
};

export default disputeReason;
