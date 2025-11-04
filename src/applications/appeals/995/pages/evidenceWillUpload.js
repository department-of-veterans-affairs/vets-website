import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  evidenceWillUploadTitle,
  evidenceWillUploadInfo,
} from '../content/evidenceWillUpload';

import { HAS_OTHER_EVIDENCE } from '../constants';
import errorMessages from '../../shared/content/errorMessages';

export default {
  uiSchema: {
    [HAS_OTHER_EVIDENCE]: yesNoUI({
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
      hideOnReview: true,
    }),

    'view:otherEvidenceInfo': {
      'ui:description': evidenceWillUploadInfo,
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
