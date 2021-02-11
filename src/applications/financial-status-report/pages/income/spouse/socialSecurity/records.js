import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import _ from 'lodash/fp';

export const uiSchema = {
  'ui:title': 'Your spouse information',
  income: {
    spouse: {
      socialSecurity: {
        socialSecurityAmount: _.merge(
          currencyUI('How much do you get for Social Security each month?'),
          {
            'ui:options': {
              widgetClassNames: 'input-size-3',
            },
          },
        ),
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    income: {
      type: 'object',
      properties: {
        spouse: {
          type: 'object',
          properties: {
            socialSecurity: {
              type: 'object',
              required: ['socialSecurityAmount'],
              properties: {
                socialSecurityAmount: {
                  type: 'number',
                },
              },
            },
          },
        },
      },
    },
  },
};
