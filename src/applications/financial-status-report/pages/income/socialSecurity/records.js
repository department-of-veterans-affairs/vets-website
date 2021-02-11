import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import _ from 'lodash/fp';

export const uiSchema = {
  'ui:title': 'Your other income',
  income: {
    socialSecurity: {
      socialSecurityAmount: _.merge(
        currencyUI('How much do you get for Social Security each month?'),
        {
          'ui:options': {
            widgetClassNames: 'input-size-3',
          },
          'ui:required': formData => formData.income.hasSocialSecurityPayments,
        },
      ),
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    income: {
      type: 'object',
      properties: {
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
