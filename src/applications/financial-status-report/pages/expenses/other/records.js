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
      expenseType: {
        'ui:title': 'Type of expense',
        'ui:field': Typeahead,
        'ui:options': {
          classNames: 'input-size-3',
          getOptions: () => formatOptions(expenseTypes),
        },
      },
      expenseAmount: _.merge(currencyUI('Estimated cost each month'), {
        'ui:options': {
          widgetClassNames: 'input-size-1',
        },
      }),
    },
  },
  'view:assetInfo': {
    'ui:description': AssetInfo,
  },
};
export const schema = {
  type: 'object',
  properties: {
    otherExpenses: {
      type: 'array',
      items: {
        type: 'object',
        required: ['expenseType', 'expenseAmount'],
        properties: {
          expenseType: {
            type: 'string',
          },
          expenseAmount: {
            type: 'number',
          },
        },
      },
    },
    'view:assetInfo': {
      type: 'object',
      properties: {},
    },
  },
};
