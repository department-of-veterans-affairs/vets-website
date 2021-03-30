import React from 'react';
import ItemLoop from '../../../components/ItemLoop';
import TableDetailsView from '../../../components/TableDetailsView';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import Typeahead from '../../../components/Typeahead';
import {
  formatOptions,
  expenseTypes,
} from '../../../constants/typeaheadOptions';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';
import _ from 'lodash/fp';

const AssetInfo = (
  <AdditionalInfo triggerText="What counts as an expense?">
    Many everyday living costs count as expenses. If you’re not sure about a
    specific expense, we encourage you to start typing the expense into the
    form. The form will help you fill in options that count as expenses.
  </AdditionalInfo>
);

export const uiSchema = {
  'ui:title': 'Other living expenses',
  otherExpenses: {
    'ui:field': ItemLoop,
    'ui:description':
      'Enter each expense separately below. For each, include an estimate of how much you pay for that expense each month.',
    'ui:options': {
      viewType: 'table',
      viewField: TableDetailsView,
      doNotScroll: true,
      showSave: true,
      itemName: 'an expense',
    },
    items: {
      'ui:options': {
        classNames: 'horizonal-field-container no-wrap',
      },
      name: {
        'ui:title': 'Type of expense',
        'ui:field': Typeahead,
        'ui:options': {
          idPrefix: 'other_expenses',
          classNames: 'input-size-3',
          getOptions: () => formatOptions(expenseTypes),
        },
      },
      amount: _.merge(currencyUI('Estimated cost each month'), {
        'ui:options': {
          widgetClassNames: 'input-size-1',
        },
      }),
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
        title: 'Expense',
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
