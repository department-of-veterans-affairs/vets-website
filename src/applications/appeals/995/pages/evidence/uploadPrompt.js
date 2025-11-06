import React from 'react';
import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { HAS_OTHER_EVIDENCE } from '../../constants';

export const uploadEvidencePromptQuestion =
  'Do you want to upload evidence to support your claim?';
export const uploadEvidencePromptError =
  'Select if you want to upload evidence';

export default {
  uiSchema: {
    [HAS_OTHER_EVIDENCE]: yesNoUI({
      title: uploadEvidencePromptQuestion,
      enableAnalytics: true,
      labelHeaderLevel: '3',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
      required: () => true,
      errorMessages: {
        required: uploadEvidencePromptError,
      },
      hideOnReview: true,
    }),

    'view:otherEvidenceInfo': {
      'ui:description': (
        <va-additional-info
          trigger="Types of supporting evidence"
          class="vads-u-margin-top--2 vads-u-margin-bottom--4"
        >
          <p>
            Supporting evidence can include private medical records or a
            lay/witness statement (sometimes called a “buddy statement”). A
            lay/witness statement is a written statement from family, friends,
            or coworkers to help support your claim.
          </p>
        </va-additional-info>
      ),
    },
  },
  schema: {
    type: 'object',
    required: [HAS_OTHER_EVIDENCE],
    properties: {
      [HAS_OTHER_EVIDENCE]: yesNoSchema,
      'view:otherEvidenceInfo': {
        type: 'object',
        properties: {},
      },
    },
  },
};
