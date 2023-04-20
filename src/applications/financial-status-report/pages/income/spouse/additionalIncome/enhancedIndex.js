import React from 'react';
import SpouseAdditionalIncomeCheckList from '../../../../components/SpouseAdditionalIncomeCheckList';

export const uiSchema = {
  'ui:title': "Your spouse's other income",
  additionalIncomeChecklist: {
    'ui:title': (
      <span className="vads-u-font-size--h4 vads-u-font-family--sans">
        Select any additional income your spouse receives:
      </span>
    ),
    'ui:widget': SpouseAdditionalIncomeCheckList,
    'ui:options': {
      hideOnReview: true,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    additionalIncomeChecklist: {
      type: 'boolean',
    },
  },
};
