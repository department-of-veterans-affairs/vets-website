import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  evidenceWillUploadTitle,
  evidenceWillUploadInfo,
} from '../content/evidenceWillUpload';

import { EVIDENCE_OTHER, errorMessages } from '../constants';

export default {
  uiSchema: {
    [EVIDENCE_OTHER]: yesNoUI({
      title: evidenceWillUploadTitle,
      enableAnalytics: true,
      labelHeaderLevel: '3',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
      required: () => true,
      errorMessages: {
        required: errorMessages.requiredYesNo,
      },
      uswds: true,
    }),

    'view:otherEvidenceInfo': {
      'ui:description': evidenceWillUploadInfo,
    },
  },
  schema: {
    type: 'object',
    required: [EVIDENCE_OTHER],
    properties: {
      [EVIDENCE_OTHER]: yesNoSchema,
      'view:otherEvidenceInfo': {
        type: 'object',
        properties: {},
      },
    },
  },
};
