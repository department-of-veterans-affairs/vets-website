import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import _ from 'lodash/fp';

export const uiSchema = {
  'ui:title': 'Your spouse information',
  benefits: {
    spouseBenefits: {
      'ui:options': {
        classNames: 'max-width-400',
      },
      benefitAmount: _.merge(
        currencyUI(
          'How much does your spouse get each month for disability compensation and pension benefits?',
        ),
        {
          'ui:options': {
            widgetClassNames: 'input-size-3',
          },
        },
      ),
      educationAmount: _.merge(
        currencyUI(
          'How much does your spouse get each month for education benefits?',
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
    benefits: {
      type: 'object',
      properties: {
        spouseBenefits: {
          type: 'object',
          required: ['benefitAmount', 'educationAmount'],
          properties: {
            benefitAmount: {
              type: 'number',
            },
            educationAmount: {
              type: 'number',
            },
          },
        },
      },
    },
  },
};
