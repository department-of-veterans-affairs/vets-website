// @ts-check
import React from 'react';
import {
  titleUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('How to submit your form'),
    // 'view:submissionInstructions': {
    ...descriptionUI(
      <div>
        <p>
          <strong>Note:</strong> This form does not submit automatically. After
          you review your information, download the completed VA Form 22-0989.
          Then, upload it manually through{' '}
          <va-link
            text="QuickSubmit"
            href="https://eauth.va.gov/accessva/?cspSelectFor=quicksubmit"
            external
          />{' '}
          or{' '}
          <va-link
            text="AskVA"
            href="https://www.va.gov/contact-us/ask-va/introduction"
            external
          />{' '}
          to complete your request.
        </p>
      </div>,
    ),
    // 'ui:options': {
    //   hideOnReview: true,
    // },
    // },
  },
  schema: {
    type: 'object',
    properties: {
      // 'view:submissionInstructions': {
      //   type: 'object',
      //   properties: {},
      // },
    },
  },
};
