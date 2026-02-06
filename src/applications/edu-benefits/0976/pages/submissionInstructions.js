// @ts-check
import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'You’ll need to upload supporting documents regarding your institution’s financial health ',
    ),
    'view:submissionInstructions': {
      'ui:description': (
        <div>
          <p>
            Have documentation that can support the status of your institution’s
            financial health and any additional documentation specific to your
            application ready to send to{' '}
            <a href="mailto:Federal.Approvals@va.gov" rel="noreferrer">
              Federal.Approvals@va.gov
            </a>
            .
          </p>
          <p>
            <strong>Note:</strong> This form does not submit automatically.
            After you review your information, download the completed VA Form
            22-0976.
          </p>
          <va-alert visible slim>
            <p className="vads-u-margin-y--0">
              In addition to submitting the completed form, you will need to
              provide documentation that can support the status of your
              institution’s financial health.
            </p>
          </va-alert>
        </div>
      ),
      'ui:options': {
        hideOnReview: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:submissionInstructions': {
        type: 'object',
        properties: {},
      },
    },
  },
};
