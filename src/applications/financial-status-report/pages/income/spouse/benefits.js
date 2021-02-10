import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import _ from 'lodash/fp';

export const uiSchema = {
  'ui:title': 'Your spouse information',
  spouseHasBenefits: {
    'ui:title': 'Does your spouse currently receive VA benefits?',
    'ui:widget': 'yesNo',
    'ui:required': () => true,
  },
  spouseBenefits: {
    'ui:options': {
      expandUnder: 'spouseHasBenefits',
    },
    compBenefits: _.merge(
      currencyUI(
        'What is the monthly amount your spouse receives for compensation and pension benefits?',
      ),
      {
        'ui:options': {
          widgetClassNames: 'input-size-4',
        },
        'ui:required': formData => formData.spouseHasBenefits,
      },
    ),
    eduBenefits: _.merge(
      currencyUI(
        'What is the monthly amount your spouse receives for education benefits?',
      ),
      {
        'ui:options': {
          widgetClassNames: 'input-size-4',
        },
        'ui:required': formData => formData.spouseHasBenefits,
      },
    ),
  },
};

export const schema = {
  type: 'object',
  properties: {
    spouseHasBenefits: {
      type: 'boolean',
    },
    spouseBenefits: {
      type: 'object',
      properties: {
        compBenefits: {
          type: 'number',
        },
        eduBenefits: {
          type: 'number',
        },
      },
    },
  },
};
