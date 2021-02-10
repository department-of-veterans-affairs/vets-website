import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import _ from 'lodash/fp';

export const uiSchema = {
  'ui:title': 'Your spouse information',
  spouseSocialSecurity: {
    hasSocialSecurity: {
      'ui:title':
        'Does your spouse currently receive Social Security payments?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
    },
    socialSecurity: {
      'ui:options': {
        expandUnder: 'hasSocialSecurity',
      },
      socialSecurityAmount: _.merge(
        currencyUI(
          'How much does your spouse receive for Social Security each month?',
        ),
        {
          'ui:options': {
            widgetClassNames: 'input-size-3',
          },
          'ui:required': formData =>
            formData.spouseSocialSecurity.hasSocialSecurity,
        },
      ),
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    spouseSocialSecurity: {
      type: 'object',
      properties: {
        hasSocialSecurity: {
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
