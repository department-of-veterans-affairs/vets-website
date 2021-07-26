import React from 'react';
import TableDetailsView from '../../../components/TableDetailsView';
import CustomReviewField from '../../../components/CustomReviewField';
import Typeahead from '../../../components/Typeahead';
import ItemLoop from '../../../components/ItemLoop';
import { validateCurrency } from '../../../utils/validations';
import {
  formatOptions,
  deductionTypes,
} from '../../../constants/typeaheadOptions';

export const uiSchema = {
  currentEmployment: {
    items: {
      'ui:title': ({ formData }) => (
        <legend className="schemaform-block-title">
          Income for your job at {formData.employerName}
        </legend>
      ),
      veteranMonthlyGrossSalary: {
        'ui:title': 'Gross monthly income',
        'ui:description': (
          <p className="formfield-subtitle">
            You’ll find this in your paycheck. It’s the amount of your pay
            before taxes and deductions.
          </p>
        ),
        'ui:options': {
          widgetClassNames: 'input-size-1 vads-u-margin-bottom--3',
          classNames: 'schemaform-currency-input',
        },
        'ui:validations': [validateCurrency],
        'ui:errorMessages': {
          required: 'Please enter your gross monthly income.',
        },
      },
      deductions: {
        'ui:field': ItemLoop,
        'ui:title': 'Payroll deductions',
        'ui:description':
          'Deductions include money withheld from your pay for things like taxes and benefits.',
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
              idPrefix: 'employment',
              getOptions: () => formatOptions(deductionTypes),
            },
          },
          amount: {
            'ui:title': 'Deduction amount',
            'ui:options': {
              widgetClassNames: 'input-size-1',
              classNames: 'schemaform-currency-input',
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
    currentEmployment: {
      type: 'array',
      items: {
        type: 'object',
        required: ['veteranMonthlyGrossSalary'],
        properties: {
          veteranMonthlyGrossSalary: {
            type: 'string',
          },
          deductions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                },
                amount: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  },
};
