import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

const description = (
  <div>
    <p>On the next screen, we’ll ask you to submit supporting documents. </p>
    <p>You’ll need to submit a copy of one of these documents:</p>
    <ul>
      <li>
        The Veteran’s separation papers (DD214), <strong>or</strong>
      </li>
      <li>
        The Veteran’s discharge documents (if you don’t have their DD214),{' '}
        <strong>or</strong>
      </li>
      <li>
        The Veteran’s pre-need determination of eligibility decision letter,{' '}
        <strong>or</strong>
      </li>
      <li>
        Any other service documents that prove the Veteran’s eligibility for a
        medallion
      </li>
    </ul>
    <a
      href="https://www.va.gov/records/discharge-documents/"
      target="_blank"
      rel="noreferrer"
    >
      Learn more about these supporting documents (opens in a new tab)
    </a>
  </div>
);

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Supporting Documents'),
    'ui:description': description,
  },
  schema: {
    type: 'object',
    properties: {},
    // required: ['homePhone'],
  },
};
