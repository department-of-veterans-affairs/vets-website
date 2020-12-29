import ItemLoop from '../../components/ItemLoop';
import TableDetailsView from '../../components/TableDetailsView';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import _ from 'lodash/fp';

export const uiSchema = {
  'ui:title': 'Your employment history',
  employment: {
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
        'ui:required': formData => formData.employment.hasBeenEmployed === true,
      },
      isCurrentlyEmployed: {
        'ui:description':
          'Please provide information about your current employment.',
        'ui:options': {
          expandUnder: 'currentlyEmployed',
        },
        employmentType: {
          'ui:title': 'Type of employment',
          'ui:options': {
            widgetClassNames: 'input-size-3',
          },
          'ui:required': formData =>
            formData.employment?.isEmployed?.currentlyEmployed === true,
        },
        employmentStart: {
          'ui:title': 'Employment start date',
          'ui:widget': 'date',
          'ui:options': {
            widgetClassNames: 'employment-start-date',
          },
          'ui:required': formData =>
            formData.employment?.isEmployed?.currentlyEmployed === true,
        },
        employerName: {
          'ui:title': 'Employer name',
          'ui:options': {
            widgetClassNames: 'input-size-6',
          },
        },
        grossMonthlyIncome: {
          ...currencyUI('Gross monthly income'),
          'ui:options': {
            classNames: 'input-size-5',
          },
          'ui:required': formData =>
            formData.employment?.isEmployed?.currentlyEmployed === true,
        },
        payrollDeductions: {
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
              'ui:options': {
                widgetClassNames: 'input-size-3',
              },
            },
            deductionAmount: _.merge(currencyUI('Deduction amount'), {
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
    employment: {
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
