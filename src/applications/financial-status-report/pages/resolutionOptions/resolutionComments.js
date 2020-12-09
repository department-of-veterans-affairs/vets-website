import React from 'react';
import FinancialOverview from '../../components/FinancialOverview';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';

const ResolutionInfo = (
  <AdditionalInfo triggerText="Why do I need to explain this?">
    Numbers on a page may not clearly show your financial status. Please provide
    more details about any special circumstances or difficulties that you or
    your family are facing. This will help us make the best decision regarding
    repayment of money owed to VA.
  </AdditionalInfo>
);

export const uiSchema = {
  financialOverview: {
    'ui:field': FinancialOverview,
  },
  'view:financialHardshipExplanation': {
    'ui:description':
      'Please explain your financial hardship or any special circumstances leading to this request for assistance.',
  },
  'view:resolutionOptionsInfo': {
    'ui:description': ResolutionInfo,
  },
  resolutionComments: {
    'ui:title': ' ',
    'ui:widget': 'textarea',
    'ui:options': {
      rows: 5,
      maxLength: 32000,
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    financialOverview: {
      type: 'object',
      properties: {
        income: {
          type: 'string',
        },
      },
    },
    'view:financialHardshipExplanation': {
      type: 'object',
      properties: {},
    },
    'view:resolutionOptionsInfo': {
      type: 'object',
      properties: {},
    },
    resolutionComments: {
      type: 'string',
    },
  },
};
