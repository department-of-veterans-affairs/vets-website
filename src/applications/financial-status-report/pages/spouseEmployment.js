// import EmploymentHistory from '../components/EmploymentHistory/EmploymentHistory';

export const uiSchema = {
  'ui:title': 'Your spouse information',
  spouseName: {
    'ui:title': "What is your spouse's name",
    'ui:class': 'foobar',
  },
  employmentHistory: {
    hasBeenEmployed: {
      'ui:title': 'Has your spouse been employed within the past two years?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
    },
    isEmployed: {
      'ui:options': {
        expandUnder: 'hasBeenEmployed',
      },
      currentlyEmployed: {
        'ui:title': 'Is your spouse currently employed?',
        'ui:widget': 'yesNo',
        'ui:required': () => true,
      },
      isCurrentlyEmployed: {
        // 'ui:field': EmploymentHistory,
        'ui:options': {
          expandUnder: 'currentlyEmployed',
        },
        'ui:description':
          'Please provide information about your spouse’s current employment.',
        employmentType: {
          'ui:title': 'Type of employment',
        },
        employmentStart: {
          'ui:title': 'Employment start date',
          'ui:widget': 'date',
        },
        employerName: {
          'ui:title': 'Employer name',
        },
        monthlyIncome: {
          'ui:title': 'Gross monthly income',
        },
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    spouseName: {
      type: 'string',
    },
    employmentHistory: {
      type: 'object',
      properties: {
        hasBeenEmployed: {
          type: 'boolean',
        },
        isEmployed: {
          type: 'object',
          properties: {
            currentlyEmployed: {
              type: 'boolean',
            },
            isCurrentlyEmployed: {
              type: 'object',
              properties: {
                employmentType: {
                  type: 'string',
                  enum: ['Full-time', 'Part-time', 'Seasonal'],
                },
                employmentStart: {
                  type: 'string',
                },
                employerName: {
                  type: 'string',
                },
                monthlyIncome: {
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
