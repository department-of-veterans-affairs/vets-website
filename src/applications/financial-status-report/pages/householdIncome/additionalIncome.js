import ItemLoop from '../../components/ItemLoop';
import IncomeView from '../../components/IncomeView';

export const uiSchema = {
  'ui:title': 'Your other income',
  additionalIncome: {
    socialSecurityPayments: {
      'ui:title': 'Do you currently receive social security payments?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
    },
    hasSocialSecurity: {
      'ui:options': {
        expandUnder: 'socialSecurityPayments',
      },
      additionalIncome: {
        'ui:title': 'Do you currently receive any additional income?',
        'ui:widget': 'yesNo',
        'ui:required': () => false,
      },
      hasAdditionalIncome: {
        'ui:options': {
          expandUnder: 'additionalIncome',
        },
        additionalIncome: {
          'ui:field': ItemLoop,
          'ui:options': {
            viewField: IncomeView,
            doNotScroll: true,
          },
          items: {
            'ui:title': 'Additional income:',
            monthlyAmount: {
              'ui:title': 'Monthly Amount',
            },
            incomeType: {
              'ui:title': 'Income Type',
            },
            employerName: {
              'ui:title': 'Employer Name',
            },
          },
        },
      },
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    additionalIncome: {
      type: 'object',
      properties: {
        socialSecurityPayments: {
          type: 'boolean',
        },
        hasSocialSecurity: {
          type: 'object',
          properties: {
            additionalIncome: {
              type: 'boolean',
            },
            hasAdditionalIncome: {
              type: 'object',
              properties: {
                additionalIncome: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      incomeType: {
                        type: 'string',
                        enum: [
                          'Income Type 1',
                          'Income Type 2',
                          'Income Type 3',
                        ],
                      },
                      monthlyAmount: {
                        type: 'string',
                      },
                      employerName: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
