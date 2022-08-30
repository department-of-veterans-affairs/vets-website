import { CurrentDebtTitle } from '../../components/CurrentDebtTitle';
import {
  validateCurrency,
  validateResolutionAmount,
} from '../../utils/validations';

export const uiSchema = {
  selectedDebtsAndCopays: {
    items: {
      'ui:title': CurrentDebtTitle,
      'ui:description': ({ formData }) => {
        return formData.resolutionOption === 'monthly'
          ? 'How much can you afford to pay monthly on this debt?'
          : 'How much can you afford to pay as a one-time payment?';
      },
      resolutionComment: {
        'ui:title': ' ',
        'ui:options': {
          classNames: 'schemaform-currency-input',
          widgetClassNames: 'input-size-3',
        },
        'ui:required': (formData, index) => {
          return (
            formData.selectedDebtsAndCopays[index]?.resolutionOption &&
            formData.selectedDebtsAndCopays[index]?.resolutionOption !==
              'waiver'
          );
        },
        'ui:validations': [validateCurrency, validateResolutionAmount],
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    selectedDebtsAndCopays: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          resolutionComment: {
            type: 'string',
          },
        },
      },
    },
  },
};
