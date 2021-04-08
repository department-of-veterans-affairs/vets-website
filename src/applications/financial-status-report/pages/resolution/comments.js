import React from 'react';
import ResolutionComments from '../../components/ResolutionComments';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';

export const uiSchema = {
  'ui:title': 'Supporting personal statement',
  additionalData: {
    additionalComments: {
      'ui:title': <ResolutionComments />,
      'ui:description': (
        <AdditionalInfo triggerText="Why do I need to share this information?">
          We want to fully understand your situation so we can make the best
          decision on your request. You can share any details that you think we
          should know about why it's hard for you or your family to repay this
          debt.
        </AdditionalInfo>
      ),
      'ui:widget': 'textarea',
      'ui:required': formData =>
        formData.selectedDebts.some(
          debt => debt.resolution?.resolutionType === 'Waiver',
        ),
      'ui:options': {
        rows: 5,
        maxLength: 32000,
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
