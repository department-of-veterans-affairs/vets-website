// @ts-check
import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI('How to submit your form'),
  'view:explanation': {
    'ui:description': (
      <div>
        <p>
          <strong>Note:</strong> This form does not submit automatically. After
          you review your information, download your completed VA Form 22-0803.
          Then, gather the required additional attachments, and take all of your
          documents to QuickSubmit to complete the submission process. This is
          the fastest way for us to process your form.
        </p>
        <p>
          If you would rather print and mail your form and attachments, the
          addresses for your region will be listed at the end of this form.
        </p>
      </div>
    ),
    'ui:options': {
      hideOnReview: true,
    },
  },
};
const schema = {
  type: 'object',
  properties: {
    'view:explanation': { type: 'object', properties: {} },
  },
};

export { schema, uiSchema };
