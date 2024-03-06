import React from 'react';
import ItemLoop from '../../../components/shared/ItemLoop';
import TableDetailsView from '../../../components/shared/TableDetailsView';
import CustomReviewField from '../../../components/shared/CustomReviewField';
import { validateCurrency } from '../../../utils/validations';
import Typeahead from '../../../components/shared/Typeahead';
import {
  formatOptions,
  incomeTypes,
} from '../../../constants/typeaheadOptions';

export const uiSchema = {
  'ui:title': () => (
    <>
      <legend className="schemaform-block-title">Your other income</legend>
      <p>Tell us how much you get each month for each type of income.</p>
    </>
  ),
  additionalIncome: {
    addlIncRecords: {
      'ui:field': ItemLoop,
      'ui:options': {
        viewType: 'table',
        viewField: TableDetailsView,
        doNotScroll: true,
        itemName: 'income',
        keepInPageOnReview: true,
      },
      items: {
        'ui:options': {
          classNames: 'horizontal-field-container no-wrap',
        },
        name: {
          'ui:title': 'Type of income',
          'ui:field': Typeahead,
          'ui:reviewField': CustomReviewField,
          'ui:options': {
            idPrefix: 'other_income',
            widgetClassNames: 'input-size-4',
            getOptions: () => formatOptions(incomeTypes),
          },
          'ui:errorMessages': {
            required: 'Please enter the type of income.',
          },
        },
        amount: {
          'ui:title': 'Monthly income amount',
          'ui:options': {
            classNames: 'schemaform-currency-input',
            widgetClassNames: 'input-size-2',
          },
          'ui:errorMessages': {
            required: 'Please enter the monthly income amount.',
          },
          'ui:validations': [validateCurrency],
        },
      },
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    additionalIncome: {
      type: 'object',
      properties: {
        addlIncRecords: {
          type: 'array',
          items: {
            type: 'object',
            required: ['name', 'amount'],
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
};
