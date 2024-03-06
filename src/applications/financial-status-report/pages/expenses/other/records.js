import React from 'react';
import ItemLoop from '../../../components/shared/ItemLoop';
import TableDetailsView from '../../../components/shared/TableDetailsView';
import CustomReviewField from '../../../components/shared/CustomReviewField';
import { validateCurrency } from '../../../utils/validations';
import Typeahead from '../../../components/shared/Typeahead';
import {
  formatOptions,
  expenseTypes,
} from '../../../constants/typeaheadOptions';

const AssetInfo = (
  <va-additional-info trigger="What counts as an expense?" uswds>
    Many everyday living costs count as expenses. If you’re not sure about a
    specific expense, we encourage you to start typing the expense into the
    form. The form will help you fill in options that count as expenses.
  </va-additional-info>
);

export const uiSchema = {
  'ui:title': 'Other living expenses',
  'ui:description':
    'Enter each expense separately below. For each, include an estimate of how much you pay for that expense each month.',
  otherExpenses: {
    'ui:field': ItemLoop,
    'ui:options': {
      viewType: 'table',
      viewField: TableDetailsView,
      doNotScroll: true,
      itemName: 'an expense',
      keepInPageOnReview: true,
    },
    items: {
      'ui:options': {
        classNames: 'horizontal-field-container no-wrap',
      },
      name: {
        'ui:title': 'Type of expense',
        'ui:field': Typeahead,
        'ui:reviewField': CustomReviewField,
        'ui:options': {
          idPrefix: 'other_expenses',
          widgetClassNames: 'input-size-3',
          getOptions: () => formatOptions(expenseTypes),
        },
        'ui:errorMessages': {
          required: 'Please enter a type of expense.',
        },
      },
      amount: {
        'ui:title': 'Estimated cost each month',
        'ui:options': {
          classNames: 'schemaform-currency-input',
          widgetClassNames: 'input-size-1',
        },
        'ui:errorMessages': {
          required: 'Please enter the monthly payment amount owed.',
        },
        'ui:validations': [validateCurrency],
      },
    },
  },
  'view:components': {
    'view:assetInfo': {
      'ui:description': AssetInfo,
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    otherExpenses: {
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
    'view:components': {
      type: 'object',
      properties: {
        'view:assetInfo': {
          type: 'object',
          properties: {},
        },
      },
    },
  },
};
