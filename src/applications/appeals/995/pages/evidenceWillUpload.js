import {
  evidenceWillUploadHeader,
  evidenceWillUploadInfo,
} from '../content/evidenceWillUpload';

import { EVIDENCE_OTHER, errorMessages } from '../constants';

export default {
  uiSchema: {
    'ui:title': ' ',
    'ui:options': {
      forceDivWrapper: true,
    },
    [EVIDENCE_OTHER]: {
      'ui:title': evidenceWillUploadHeader,
      'ui:widget': 'yesNo',
      'ui:errorMessages': {
        required: errorMessages.requiredYesNo,
      },
      'ui:options': {
        hideOnReview: true,
        enableAnalytics: true,
      },
    },
    'view:otherEvidenceInfo': {
      'ui:description': evidenceWillUploadInfo,
    },
  },
  schema: {
    type: 'object',
    required: [EVIDENCE_OTHER],
    properties: {
      [EVIDENCE_OTHER]: {
        type: 'boolean',
      },
      'view:otherEvidenceInfo': {
        type: 'object',
        properties: {},
      },
    },
  },
};
