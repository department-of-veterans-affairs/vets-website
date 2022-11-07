import React from 'react';
import MonetaryCheckList from '../../../components/monetary/MonetaryCheckList';

export const uiSchema = {
  'ui:title': 'Your household assets',
  monetaryAssets: {
    'ui:title': (
      <span className="vads-u-font-size--h4 vads-u-font-family--sans">
        Select any of these financial assets you have:
      </span>
    ),
    'ui:widget': MonetaryCheckList,
    'ui:options': {
      hideOnReview: true,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    monetaryAssets: {
      type: 'boolean',
    },
  },
};
