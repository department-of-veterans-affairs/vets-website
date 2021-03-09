import React from 'react';
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
  'ui:title': 'Supporting personal statement',
  'view:components': {
    'view:financialHardshipExplanation': {
      'ui:field': FinancialHardshipExplanation,
    },
    'view:resolutionOptionsInfo': {
      'ui:description': ResolutionInfo,
    },
  },
  additionalData: {
    additionalComments: {
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
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:components': {
      type: 'object',
      properties: {
        'view:financialHardshipExplanation': {
          type: 'object',
          properties: {},
        },
        'view:resolutionOptionsInfo': {
          type: 'object',
          properties: {},
        },
      },
    },
    additionalData: {
      type: 'object',
      properties: {
        additionalComments: {
          type: 'string',
        },
      },
    },
  },
};
