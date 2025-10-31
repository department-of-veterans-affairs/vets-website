import React from 'react';
import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { EVIDENCE_VA } from '../constants';
import errorMessages from '../../shared/content/errorMessages';

export const title =
  'Do you want us to get your VA medical records or military health records?';

export default {
  uiSchema: {
    [EVIDENCE_VA]: yesNoUI({
      title,
      description: (
        <>
          <p>
            We can collect your VA medical records or military health records
            from any of these sources to support your claim:
          </p>
          <ul>
            <li>VA medical center</li>
            <li>Community-based outpatient clinic</li>
            <li>Department of Defense military treatment facility</li>
            <li>Community care provider paid for by VA</li>
          </ul>
          <p>We’ll ask you the names of the treatment locations to include.</p>
          <p>
            <strong>Note:</strong> Later in this form, we'll ask about your
            private (non-VA) provider medical records.
          </p>
        </>
      ),
      enableAnalytics: true,
      classNames: 'vads-u-margin-bottom--4',
      labelHeaderLevel: '3',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
      required: () => true,
      errorMessages: {
        required: errorMessages.requiredYesNo,
      },
      hideOnReview: true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      [EVIDENCE_VA]: yesNoSchema,
      'view:vaEvidenceInfo': {
        type: 'object',
        properties: {},
      },
    },
  },
};
