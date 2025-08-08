import VaRadioField from 'platform/forms-system/src/js/web-component-fields/VaRadioField';
import DebtTitle from '../components/DebtTitle';
import { DISPUTE_REASONS } from '../constants';

const disputeReason = {
  uiSchema: {
    selectedDebts: {
      items: {
        'ui:title': DebtTitle,
        disputeReason: {
          'ui:title': "Select the reason you're disputing this debt.",
          'ui:webComponentField': VaRadioField,
          'ui:required': () => true,
          'ui:options': {
            labels: {
              EXISTENCE: DISPUTE_REASONS.EXISTENCE,
              AMOUNT: DISPUTE_REASONS.AMOUNT,
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
              enum: [DISPUTE_REASONS.EXISTENCE, DISPUTE_REASONS.AMOUNT],
            },
          },
          required: ['disputeReason'],
        },
      },
    },
  },
};

export default disputeReason;
