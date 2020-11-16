import EmploymentHistory from '../components/EmploymentHistory';

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
        'ui:field': EmploymentHistory,
        'ui:options': {
          expandUnder: 'view:currentlyEmployed',
        },
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
        // payrollDeductions: {
        //   'ui:field': 'ArrayField',
        //   'ui:options': {},
        // },
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
                employmentType: {
                  type: 'string',
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
                payrollDeductions: {
                  type: 'number',
                },
                // payrollDeductions: {
                //   type: 'array',
                //   items: {
                //     type: 'number',
                //     title: 'Input Amount',
                //     default: 0,
                //   },
                // },
              },
            },
          },
        },
      },
    },
  },
};
