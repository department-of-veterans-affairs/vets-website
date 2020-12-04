import EmploymentHistory from '../../components/EmploymentHistory/EmploymentHistory';

export const uiSchema = {
  'ui:title': 'Your employment history',
  employmentHistory: {
    hasBeenEmployed: {
      'ui:title': 'Have you been employed within the past two years?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
    },
    isEmployed: {
      'ui:options': {
        expandUnder: 'hasBeenEmployed',
      },
      currentlyEmployed: {
        'ui:title': 'Are you currently employed?',
        'ui:widget': 'yesNo',
        'ui:required': () => false,
      },
      isCurrentlyEmployed: {
        'ui:field': EmploymentHistory,
        'ui:options': {
          expandUnder: 'currentlyEmployed',
        },
        employmentType: {
          'ui:title': 'Type of employment',
        },
        employmentStart: {
          'ui:title': 'Employment start date',
          'ui:widget': 'date',
        },
        employmentEnd: {
          'ui:title': 'Employment end date',
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
                },
                employmentStart: {
                  type: 'string',
                },
                employmentEnd: {
                  type: 'string',
                },
                employerName: {
                  type: 'string',
                },
                monthlyIncome: {
                  type: 'number',
                },
                payrollDeductions: {
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
