import ItemLoop from '../../components/ItemLoop';
import TableDetailsView from '../../components/TableDetailsView';

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
      },
      isCurrentlyEmployed: {
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
        employerName: {
          'ui:title': 'Employer name',
        },
        grossMonthlyIncome: {
          'ui:title': 'Gross monthly income',
        },
        payrollDeductions: {
          'ui:title': 'Payroll deductions',
          'ui:description':
            'You can find your payroll deductions in a recent paycheck.',
          'ui:field': ItemLoop,
          'ui:options': {
            viewType: 'table',
            viewField: TableDetailsView,
            doNotScroll: true,
            showSave: true,
          },
          items: {
            'ui:title': 'Add a payroll deduction',
            deductionType: {
              'ui:title': 'Type of payroll deduction',
            },
            deductionAmount: {
              'ui:title': 'Deduction amount',
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
                grossMonthlyIncome: {
                  type: 'number',
                },
                payrollDeductions: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      deductionType: {
                        type: 'string',
                      },
                      deductionAmount: {
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
