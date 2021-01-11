import ItemLoop from '../../components/ItemLoop';
import TableDetailsView from '../../components/TableDetailsView';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import _ from 'lodash/fp';

export const uiSchema = {
  'ui:title': 'Your spouse information',
  spouseName: {
    'ui:title': "What is your spouse's name?",
    'ui:options': {
      widgetClassNames: 'input-size-3',
    },
  },
  employment: {
    spouseHasBeenEmployed: {
      'ui:title': 'Has your spouse been employed within the past two years?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
    },
    spouseIsEmployed: {
      'ui:options': {
        expandUnder: 'spouseHasBeenEmployed',
      },
      spouseCurrentlyEmployed: {
        'ui:title': 'Is your spouse currently employed?',
        'ui:widget': 'yesNo',
        'ui:required': formData => formData.employment.spouseHasBeenEmployed,
      },
      isSpouseCurrentlyEmployed: {
        'ui:options': {
          expandUnder: 'spouseCurrentlyEmployed',
        },
        'ui:description':
          'Please provide information about your spouse’s current employment.',
        spouseEmploymentType: {
          'ui:title': 'Type of employment',
          'ui:options': {
            widgetClassNames: 'input-size-3',
          },
        },
        spouseEmploymentStart: {
          'ui:title': 'Employment start date',
          'ui:widget': 'date',
          'ui:required': formData =>
            formData.employment.spouseIsEmployed?.spouseCurrentlyEmployed,
        },
        spouseEmployerName: {
          'ui:title': 'Employer name',
          'ui:options': {
            widgetClassNames: 'input-size-6',
          },
        },
        spouseIncome: _.merge(currencyUI('Gross monthly income'), {
          'ui:required': formData =>
            formData.employment.spouseIsEmployed?.spouseCurrentlyEmployed,
          'ui:options': {
            widgetClassNames: 'input-size-2',
          },
        }),
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
            itemName: 'payroll deduction',
          },
          items: {
            spouseDeductionType: {
              'ui:title': 'Type of payroll deduction',
              'ui:options': {
                widgetClassNames: 'input-size-3',
              },
            },
            spouseDeductionAmount: _.merge(currencyUI('Deduction amount'), {
              'ui:options': {
                widgetClassNames: 'input-size-1',
              },
            }),
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
    employment: {
      type: 'object',
      properties: {
        spouseHasBeenEmployed: {
          type: 'boolean',
        },
        spouseIsEmployed: {
          type: 'object',
          properties: {
            spouseCurrentlyEmployed: {
              type: 'boolean',
            },
            isSpouseCurrentlyEmployed: {
              type: 'object',
              properties: {
                spouseEmploymentType: {
                  type: 'string',
                  enum: ['Full time', 'Part time', 'Seasonal', 'Temporary'],
                },
                spouseEmploymentStart: {
                  type: 'string',
                },
                spouseEmployerName: {
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
                      spouseDeductionType: {
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
