import ItemLoop from '../../../../components/ItemLoop';
import TableDetailsView from '../../../../components/TableDetailsView';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import Typeahead from '../../../../components/Typeahead';
import {
  formatOptions,
  deductionTypes,
} from '../../../../constants/typeaheadOptions';
import _ from 'lodash/fp';

import React from 'react';

export const uiSchema = {
  'ui:title': 'Your spouse information',
  employment: {
    'ui:options': {
      classNames: 'current-employment-container',
    },
    spouse: {
      currentEmployment: {
        'ui:description': "Tell us about your spouse's current job.",
        employmentType: {
          'ui:title': 'Type of work',
          'ui:options': {
            classNames: 'vads-u-margin-top--3',
            widgetClassNames: 'input-size-3',
          },
        },
        employmentStart: {
          'ui:title': 'Date your spouse started work at this job',
          'ui:widget': 'date',
        },
        employerName: {
          'ui:title': 'Employer name',
          'ui:options': {
            widgetClassNames: 'input-size-6',
          },
        },
        grossMonthlyIncome: _.merge(currencyUI('Gross monthly income'), {
          'ui:options': {
            widgetClassNames: 'input-size-1 vads-u-margin-bottom--3',
          },
          'ui:description': (
            <p className="formfield-subtitle">
              You’ll find this in your spouse's paycheck. It’s the amount of
              your pay before taxes and deductions.
            </p>
          ),
        }),
        payrollDeductions: {
          'ui:field': ItemLoop,
          'ui:title': 'Payroll deductions',
          'ui:description':
            'You’ll find your spouse’s payroll deductions in a recent paycheck. Deductions include money withheld from their pay for things like taxes and benefits.',
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
  },
};

export const schema = {
  type: 'object',
  properties: {
    employment: {
      type: 'object',
      properties: {
        spouse: {
          type: 'object',
          properties: {
            currentEmployment: {
              type: 'object',
              required: [
                'employmentType',
                'employmentStart',
                'grossMonthlyIncome',
              ],
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
    },
  },
};
