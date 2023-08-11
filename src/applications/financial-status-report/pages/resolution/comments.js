import React from 'react';

export const uiSchema = {
  'ui:title': () => (
    <>
      <legend className="schemaform-block-title">
        <h3 className="vads-u-margin--0">Supporting personal statement</h3>
      </legend>
    </>
  ),
  additionalData: {
    'ui:options': {
      customTitle: ' ',
    },
    additionalComments: {
      'ui:title':
        'Please tell us more about why you need help with this debt(s)',
      'ui:description': (
        <va-additional-info trigger="Why do I need to share this information?">
          We want to fully understand your situation so we can make the best
          decision on your request. You can share any details that you think we
          should know about why it is hard for you or your family to repay this
          debt.
        </va-additional-info>
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
      'ui:required': formData => {
        return formData.selectedDebtsAndCopays?.some(
          debt => debt.resolutionOption === 'waiver',
        );
      },
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
