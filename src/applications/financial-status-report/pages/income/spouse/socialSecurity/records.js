import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import _ from 'lodash/fp';

export const uiSchema = {
  'ui:title': 'Your spouse information',
  socialSecurity: {
    spouse: {
      'ui:options': {
        classNames: 'no-wrap',
      },
      socialSecurityAmount: _.merge(
        currencyUI(
          'How much does your spouse get for Social Security each month?',
        ),
        {
          'ui:options': {
            widgetClassNames: 'input-size-3',
          },
        },
      ),
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    socialSecurity: {
      type: 'object',
      properties: {
        spouse: {
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
};
