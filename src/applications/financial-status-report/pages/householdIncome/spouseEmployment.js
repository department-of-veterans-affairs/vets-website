import ItemLoop from '../../components/ItemLoop';
import TableDetailsView from '../../components/TableDetailsView';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';

export const uiSchema = {
  'ui:title': 'Your spouse information',
  spouseName: {
    'ui:title': "What is your spouse's name?",
    'ui:options': {
      widgetClassNames: 'input-size-3',
    },
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
      },
      isCurrentlyEmployed: {
        'ui:options': {
          expandUnder: 'currentlyEmployed',
        },
        'ui:description':
          'Please provide information about your spouse’s current employment.',
        employmentType: {
          'ui:title': 'Type of employment',
          'ui:options': {
            widgetClassNames: 'input-size-3',
          },
        },
        employmentStart: {
          'ui:title': 'Employment start date',
          'ui:widget': 'date',
        },
        employerName: {
          'ui:title': 'Employer name',
        },
        spouseIncome: currencyUI('Gross monthly income'),
        spousePayrollDeductions: {
          'ui:field': ItemLoop,
          'ui:title': 'Payroll deductions',
          'ui:description':
            'You can find your payroll deductions in a recent paycheck.',
          'ui:options': {
            viewType: 'table',
            viewField: TableDetailsView,
            doNotScroll: true,
            showSave: true,
            itemName: 'Add a payroll deduction',
          },
          items: {
            deductionType: {
              'ui:title': 'Type of payroll deduction',
            },
            spouseDeductionAmount: currencyUI('Deduction amount'),
          },
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
                  enum: ['Full time', 'Part time', 'Seasonal', 'Temporary'],
                },
                employmentStart: {
                  type: 'string',
                },
                employerName: {
                  type: 'string',
                },
                spouseIncome: {
                  type: 'number',
                },
                spousePayrollDeductions: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      deductionType: {
                        type: 'string',
                      },
                      spouseDeductionAmount: {
                        type: 'number',
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
