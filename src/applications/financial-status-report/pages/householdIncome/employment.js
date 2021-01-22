import ItemLoop from '../../components/ItemLoop';
import TableDetailsView from '../../components/TableDetailsView';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import Typeahead from '../../components/Typeahead';
import {
  formatOptions,
  deductionTypes,
} from '../../constants/typeaheadOptions';
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
        'ui:required': formData => formData.employment.hasBeenEmployed,
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
            formData.employment?.isEmployed?.currentlyEmployed,
        },
        employmentStart: {
          'ui:title': 'Employment start date',
          'ui:widget': 'date',
          'ui:options': {
            widgetClassNames: 'employment-start-date',
          },
          'ui:required': formData =>
            formData.employment?.isEmployed?.currentlyEmployed,
        },
        employerName: {
          'ui:title': 'Employer name',
          'ui:options': {
            widgetClassNames: 'input-size-6',
          },
        },
        grossMonthlyIncome: _.merge(currencyUI('Gross monthly income'), {
          'ui:options': {
            widgetClassNames: 'input-size-1',
          },
          'ui:required': formData =>
            formData.employment?.isEmployed?.currentlyEmployed,
        }),
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
            itemName: 'payroll deduction',
          },
          items: {
            deductionType: {
              'ui:title': 'Type of payroll deduction',
              'ui:field': Typeahead,
              'ui:options': {
                classNames: 'input-size-3',
                getOptions: () => formatOptions(deductionTypes),
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
