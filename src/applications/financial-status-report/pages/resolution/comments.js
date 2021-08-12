import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';

export const uiSchema = {
  'ui:title': 'Supporting personal statement',
  additionalData: {
    'ui:options': {
      customTitle: ' ',
    },
    additionalComments: {
      'ui:title': 'Please tell us more about why you need help with this debt',
      'ui:description': (
        <AdditionalInfo triggerText="Why do I need to share this information?">
          We want to fully understand your situation so we can make the best
          decision on your request. You can share any details that you think we
          should know about why it's hard for you or your family to repay this
          debt.
        </AdditionalInfo>
      ),
      'ui:reviewField': ({
        children: {
          props: { formData },
        },
      }) => (
        <div className="review-row">
          <div>{formData}</div>
        </div>
      ),
      'ui:widget': 'textarea',
      'ui:required': formData =>
        formData.selectedDebts?.some(
          debt => debt.resolution?.resolutionType === 'Waiver',
        ),
      'ui:options': {
        rows: 5,
        maxLength: 32000,
        customTitle: ' ',
        classNames: 'resolution-comments',
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
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
