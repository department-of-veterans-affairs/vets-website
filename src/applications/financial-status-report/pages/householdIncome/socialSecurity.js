import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import _ from 'lodash/fp';

export const uiSchema = {
  'ui:title': 'Your other income',
  additionalIncome: {
    hasSocialSecurityPayments: {
      'ui:title': 'Do you currently receive social security payments?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
    },
    socialSecurity: {
      'ui:options': {
        expandUnder: 'hasSocialSecurityPayments',
      },
      socialSecurityAmount: _.merge(
        currencyUI('How much do you receive for Social Security each month?'),
        {
          'ui:options': {
            widgetClassNames: 'input-size-3',
          },
          'ui:required': formData =>
            formData.additionalIncome.hasSocialSecurityPayments,
        },
      ),
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    additionalIncome: {
      type: 'object',
      properties: {
        hasSocialSecurityPayments: {
          type: 'boolean',
        },
        socialSecurity: {
          type: 'object',
          properties: {
            socialSecurityAmount: {
              type: 'number',
            },
          },
        },
      },
    },
  },
};
