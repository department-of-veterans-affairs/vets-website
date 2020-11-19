import ListLoop from '../components/ListLoop';

export const uiSchema = {
  otherIncome: {
    'ui:title': 'Your other income',
    'view:socialSecurityPayments': {
      'ui:title': 'Do you currently receive social security payments?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
    },
    'view:hasSocialSecurity': {
      'ui:options': {
        expandUnder: 'view:socialSecurityPayments',
      },
      'view:additionalIncome': {
        'ui:title': 'Do you currently receive any additional income?',
        'ui:widget': 'yesNo',
        'ui:required': () => true,
      },
      'view:hasAdditionalIncome': {
        'ui:options': {
          expandUnder: 'view:additionalIncome',
        },
        incomeType: {
          'ui:title': 'Type of income',
        },
        monthlyAmount: {
          'ui:title': 'Monthly amount',
        },
        employerName: {
          'ui:title': 'Employer name',
        },
        'ui:field': ListLoop,
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    otherIncome: {
      type: 'object',
      properties: {
        'view:socialSecurityPayments': {
          type: 'boolean',
        },
        'view:hasSocialSecurity': {
          type: 'object',
          properties: {
            'view:additionalIncome': {
              type: 'boolean',
            },
            'view:hasAdditionalIncome': {
              type: 'object',
              properties: {
                incomeType: {
                  type: 'string',
                  enum: ['Income Type 1', 'Income Type 2', 'Income Type 3'],
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
};
