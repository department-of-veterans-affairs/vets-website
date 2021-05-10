import React from 'react';
import _ from 'lodash/fp';
import ItemLoop from '../../../../components/ItemLoop';
import TableDetailsView from '../../../../components/TableDetailsView';
import CustomReviewField from '../../../../components/CustomReviewField';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import Typeahead from '../../../../components/Typeahead';
import monthYearUI from 'platform/forms-system/src/js/definitions/monthYear';
import {
  formatOptions,
  deductionTypes,
} from '../../../../constants/typeaheadOptions';

export const uiSchema = {
  'ui:title': 'Your spouse information',
  personalData: {
    employmentHistory: {
      'ui:options': {
        classNames: 'current-employment-container',
      },
      spouse: {
        currentEmployment: {
          'ui:description': "Tell us about your spouse's current job.",
          type: {
            'ui:title': 'Type of work',
            'ui:options': {
              classNames: 'vads-u-margin-top--3',
              widgetClassNames: 'input-size-3',
            },
          },
          from: monthYearUI('Date your spouse started work at this job'),
          employerName: {
            'ui:title': 'Employer name',
            'ui:options': {
              widgetClassNames: 'input-size-6',
            },
          },
          monthlyGrossSalary: _.merge(currencyUI('Gross monthly income'), {
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
          spouseDeductions: {
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
              keepInPageOnReview: true,
            },
            items: {
              'ui:options': {
                classNames: 'horizontal-field-container no-wrap',
              },
              name: {
                'ui:title': 'Type of payroll deduction',
                'ui:field': Typeahead,
                'ui:reviewField': CustomReviewField,
                'ui:options': {
                  idPrefix: 'spouse_employment',
                  getOptions: () => formatOptions(deductionTypes),
                },
              },
              amount: _.merge(currencyUI('Deduction amount'), {
                'ui:options': {
                  widgetClassNames: 'input-size-1',
                },
              }),
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
    personalData: {
      type: 'object',
      properties: {
        employmentHistory: {
          type: 'object',
          properties: {
            spouse: {
              type: 'object',
              properties: {
                currentEmployment: {
                  type: 'object',
                  required: ['type', 'from', 'monthlyGrossSalary'],
                  properties: {
                    type: {
                      type: 'string',
                      enum: [
                        'Contractor',
                        'Full time',
                        'Part time',
                        'Seasonal',
                        'Temporary',
                      ],
                    },
                    from: {
                      type: 'string',
                    },
                    employerName: {
                      type: 'string',
                    },
                    monthlyGrossSalary: {
                      type: 'number',
                    },
                    spouseDeductions: {
                      type: 'array',
                      items: {
                        type: 'object',
                        required: ['name', 'amount'],
                        properties: {
                          name: {
                            type: 'string',
                          },
                          amount: {
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
    },
  },
};
