import React from 'react';
import FinancialOverview from '../../components/FinancialOverview';
import FinancialHardshipExplanation from '../../components/FinancialHardshipExplanation';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';

const ResolutionInfo = (
  <AdditionalInfo triggerText="Why do I need to share this information?">
    We want to fully understand your situation so we can make the best decision
    on your request. You can share any details that you think we should know
    about why it's hard for you or your family to repay this debt.
  </AdditionalInfo>
);

export const uiSchema = {
  financialOverview: {
    'ui:field': FinancialOverview,
  },
  'view:financialHardshipExplanation': {
    'ui:field': FinancialHardshipExplanation,
  },
  'view:resolutionOptionsInfo': {
    'ui:description': ResolutionInfo,
  },
  resolutionComments: {
    'ui:title': ' ',
    'ui:widget': 'textarea',
    'ui:required': formData =>
      formData.fsrDebts.some(
        debt => debt.resolution?.resolutionType === 'Waiver',
      ),
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
