import ItemLoop from '../../../components/ItemLoop';
import TableDetailsView from '../../../components/TableDetailsView';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import Typeahead from '../../../components/Typeahead';
import {
  formatOptions,
  deductionTypes,
} from '../../../constants/typeaheadOptions';
import _ from 'lodash/fp';

import React from 'react';

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
          widgetClassNames: 'input-size-3',
        },
        'ui:required': formData => formData.employment?.isEmployed,
      },
      employmentStart: {
        'ui:title': 'Date you started work at this job',
        'ui:widget': 'date',
        'ui:options': {
          classNames: 'employment-start',
        },
        'ui:required': formData => formData.employment?.isEmployed,
      },
      employerName: {
        'ui:title': 'Employer name',
        'ui:options': {
          classNames: 'employer-name',
          widgetClassNames: 'input-size-6',
        },
      },
      grossMonthlyIncome: _.merge(currencyUI('Gross monthly income'), {
        'ui:options': {
          widgetClassNames: 'input-size-1',
        },
        'ui:required': formData => formData.employment?.isEmployed,
      }),
      'view:employmentNote': {
        'ui:description': (
          <p>
            <strong>Note: </strong>
            You’ll find this in your paycheck. It’s the amount of your pay
            before taxes and deductions.
          </p>
        ),
      },
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
          deductionType: {
            'ui:title': 'Type of payroll deduction',
            'ui:field': Typeahead,
            'ui:options': {
              classNames: 'input-size-5',
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
            'view:employmentNote': {
              type: 'object',
              properties: {},
            },
            payrollDeductions: {
              type: 'array',
              items: {
                type: 'object',
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
