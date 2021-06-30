import React from 'react';
import TableDetailsView from '../../../../components/TableDetailsView';
import CustomReviewField from '../../../../components/CustomReviewField';
import Typeahead from '../../../../components/Typeahead';
import ItemLoop from '../../../../components/ItemLoop';
import { validateCurrency } from '../../../../utils/validations';
import {
  formatOptions,
  deductionTypes,
} from '../../../../constants/typeaheadOptions';

export const uiSchema = {
  spouseCurrentEmployment: {
    items: {
      'ui:title': ({ formData }) => (
        <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--3">
          Income for your spouse’s job at {formData.employerName}
        </h3>
      ),
      monthlyGrossSalary: {
        'ui:title': 'Gross monthly income',
        'ui:description': (
          <p className="formfield-subtitle">
            You’ll find this in your spouse’s paycheck. It’s the amount of your
            spouse’s pay before taxes and deductions.
          </p>
        ),
        'ui:options': {
          widgetClassNames: 'input-size-1 vads-u-margin-bottom--3',
          classNames: 'schemaform-currency-input',
        },
        'ui:validations': [validateCurrency],
        'ui:errorMessages': {
          required: "Please enter your spouse's gross monthly income.",
        },
      },
      deductions: {
        'ui:field': ItemLoop,
        'ui:title': 'Payroll deductions',
        'ui:description':
          'Deductions include money withheld from your spouse’s pay for things like taxes and benefits.',
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
    spouseCurrentEmployment: {
      type: 'array',
      items: {
        type: 'object',
        required: ['monthlyGrossSalary'],
        properties: {
          monthlyGrossSalary: {
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
