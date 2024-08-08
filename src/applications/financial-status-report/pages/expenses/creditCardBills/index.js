import React from 'react';
import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const title = 'Do you have any past-due credit card bills?';
export const uiSchema = {
  'ui:title': () => (
    <>
      <legend className="schemaform-block-title">
        <h3 className="vads-u-margin--0">Credit card bills</h3>
      </legend>
    </>
  ),
  questions: {
    hasCreditCardBills: yesNoUI({
      title,
      enableAnalytics: true,
      uswds: true,
      required: () => true,
      errorMessages: {
        required: 'Please enter your credit card bill information.',
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
        hasCreditCardBills: yesNoSchema,
      },
    },
  },
};
