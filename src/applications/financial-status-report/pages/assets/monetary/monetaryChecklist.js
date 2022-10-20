import React from 'react';
import MonetaryCheckList from '../../../components/monetary/MonetaryCheckList';

export const TuiSchema = {
  'ui:title': 'Your other income',
  additionalIncomeChecklist: {
    'ui:title': (
      <span className="vads-u-font-size--h4 vads-u-font-family--sans">
        Select any additional income you receive:
      </span>
    ),
    'ui:widget': MonetaryCheckList,
    'ui:required': formData => {
      const {
        assets: { monetaryAssets = [] },
      } = formData;

      return !monetaryAssets.length;
    },
    'ui:errorMessages': {
      required: 'I am an error message',
    },
    'ui:options': {
      hideOnReview: true,
    },
  },
};

export const Tschema = {
  type: 'object',
  properties: {
    additionalIncomeChecklist: {
      type: 'boolean',
    },
  },
};
