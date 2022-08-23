import { CurrentDebtTitle } from '../../components/CurrentDebtTitle';

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
        'ui:errorMessages': {
          required: 'Please enter a valid number.',
        },
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
        // required: ['resolutionComment'],
        properties: {
          resolutionComment: {
            type: 'string',
          },
        },
      },
    },
  },
};
