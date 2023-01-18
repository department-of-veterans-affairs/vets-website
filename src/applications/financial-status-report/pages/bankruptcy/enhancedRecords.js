import React from 'react';
import BankruptcyHistoryDetails from '../../components/BankruptcyHistoryDetails';

export const uiSchema = {
  bankruptcyHistoryDetails: {
    'ui:title': (
      <span className="vads-u-font-size--h4 vads-u-font-family--sans" />
    ),
    'ui:widget': BankruptcyHistoryDetails,
    'ui:options': {
      hideOnReview: true,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    bankruptcyHistoryDetails: {
      type: 'boolean',
    },
  },
};
