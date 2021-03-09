import React from 'react';
import _ from 'lodash/fp';
import ItemLoop from '../../../components/ItemLoop';
import TableDetailsView from '../../../components/TableDetailsView';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import Typeahead from '../../../components/Typeahead';
import {
  formatOptions,
  deductionTypes,
} from '../../../constants/typeaheadOptions';

export const uiSchema = {
  'ui:title': 'Your work history',
  employment: {
    'ui:options': {
      classNames: 'current-employment-container',
    },
    currentEmployment: {
      'ui:description': 'Tell us about your current job.',
      employmentType: {
        'ui:title': 'Type of work',
        'ui:options': {
          classNames: 'vads-u-margin-top--3',
          widgetClassNames: 'input-size-3',
        },
      },
      employmentStart: {
        'ui:title': 'Date you started work at this job',
        'ui:widget': 'date',
        'ui:options': {
          widgetClassNames: 'vads-u-margin-top--3',
        },
      },
      employerName: {
        'ui:title': 'Employer name',
        'ui:options': {
          widgetClassNames: 'input-size-6',
        },
      },
      grossMonthlyIncome: _.merge(currencyUI('Gross monthly income'), {
        'ui:description': (
          <p className="formfield-subtitle">
            You’ll find this in your paycheck. It’s the amount of your pay
            before taxes and deductions.
          </p>
        ),
        'ui:options': {
          widgetClassNames: 'input-size-1 vads-u-margin-bottom--3',
        },
      }),
      payrollDeductions: {
        'ui:field': ItemLoop,
        'ui:title': 'Payroll deductions',
        'ui:description':
          'You’ll find your payroll deductions in a recent paycheck. Deductions include money withheld from your pay for things like taxes and benefits.',
        'ui:options': {
          viewType: 'table',
          viewField: TableDetailsView,
          doNotScroll: true,
          showSave: true,
          itemName: 'payroll deduction',
        },
        items: {
          'ui:options': {
            classNames: 'horizonal-field-container no-wrap',
          },
          deductionType: {
            'ui:title': 'Type of payroll deduction',
            'ui:field': Typeahead,
            'ui:options': {
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
};

export const schema = {
  type: 'object',
  properties: {
    employment: {
      type: 'object',
      properties: {
        currentEmployment: {
          type: 'object',
          required: ['employmentType', 'employmentStart', 'grossMonthlyIncome'],
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
                title: 'Deduction',
                required: ['deductionType', 'deductionAmount'],
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
};
