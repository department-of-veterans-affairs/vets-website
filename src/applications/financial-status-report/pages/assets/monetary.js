import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import _ from 'lodash/fp';
import React from 'react';

export const uiSchema = {
  'ui:title': 'Your household assets',
  'ui:description': (
    <div className="assets-note">
      <strong>Note: </strong> For each question below, include the total amounts
      for you and your spouse. If you don’t have any of these items, answer “0”.
    </div>
  ),
  householdAssets: {
    'ui:options': {
      classNames: 'no-wrap',
    },
    checkingAndSavings: _.merge(
      currencyUI(
        'How much money do you have in checking and savings accounts?',
      ),
      {
        'ui:options': {
          widgetClassNames: 'input-size-3',
        },
      },
    ),
    availableAssets: _.merge(
      currencyUI('How much other cash do you have access to at this time?'),
      {
        'ui:options': {
          widgetClassNames: 'input-size-3',
        },
      },
    ),
    savingsBonds: _.merge(
      currencyUI('What’s the current value of your U.S. Savings Bonds?'),
      {
        'ui:options': {
          widgetClassNames: 'input-size-3',
        },
      },
    ),
    stocksAndOtherBonds: _.merge(
      currencyUI('What’s the current value of your stocks and other bonds?'),
      {
        'ui:options': {
          widgetClassNames: 'input-size-3',
        },
      },
    ),
  },
};

export const schema = {
  type: 'object',
  properties: {
    householdAssets: {
      type: 'object',
      required: [
        'checkingAndSavings',
        'availableAssets',
        'savingsBonds',
        'stocksAndOtherBonds',
      ],
      properties: {
        checkingAndSavings: {
          type: 'number',
        },
        availableAssets: {
          type: 'number',
        },
        savingsBonds: {
          type: 'number',
        },
        stocksAndOtherBonds: {
          type: 'number',
        },
      },
    },
  },
};
