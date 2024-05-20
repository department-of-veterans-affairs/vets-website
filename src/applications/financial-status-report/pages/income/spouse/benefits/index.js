import React from 'react';
import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const title = 'Does your spouse get VA benefits?';
export const uiSchema = {
  'ui:title': () => (
    <>
      <legend className="schemaform-block-title">
        <h3 className="vads-u-margin--0">Your spouse information</h3>
      </legend>
    </>
  ),
  questions: {
    spouseHasBenefits: yesNoUI({
      title,
      enableAnalytics: true,
      uswds: true,
      required: () => true,
      errorMessages: {
        required: 'Please enter your spouse’s VA benefits information.',
      },
    }),
  },
};

export const schema = {
  type: 'object',
  properties: {
    questions: {
      type: 'object',
      properties: {
        spouseHasBenefits: yesNoSchema,
      },
    },
  },
};
