import ListLoop from '../components/ListLoop';

export const uiSchema = {
  employmentHistory: {
    'ui:title': 'Your employment history',
    'view:hasBeenEmployed': {
      'ui:title': 'Have you been employed within the past two years?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
    },
    'view:isEmployed': {
      'ui:options': {
        expandUnder: 'view:hasBeenEmployed',
      },
      'view:currentlyEmployed': {
        'ui:title': 'Are you currently employed?',
        'ui:widget': 'yesNo',
        'ui:required': () => true,
      },
      'view:isCurrentlyEmployed': {
        'ui:options': {
          expandUnder: 'view:currentlyEmployed',
        },
        incomeType: {
          'ui:title': 'Type of income',
        },
        monthlyAmount: {
          'ui:title': 'Monthly amount',
        },
        employmentStart: {
          'ui:title': 'Employment start date',
          'ui:widget': 'date',
          'ui:required': () => true,
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
    employmentHistory: {
      type: 'object',
      properties: {
        'view:hasBeenEmployed': {
          type: 'boolean',
        },
        'view:isEmployed': {
          type: 'object',
          properties: {
            'view:currentlyEmployed': {
              type: 'boolean',
            },
            'view:isCurrentlyEmployed': {
              type: 'object',
              properties: {
                incomeType: {
                  type: 'string',
                  enum: ['Income Type 1', 'Income Type 2', 'Income Type 3'],
                },
                monthlyAmount: {
                  type: 'string',
                },
                employmentStart: {
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
