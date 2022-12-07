import {
  evidenceUploadOtherHeader,
  evidenceUploadOtherInfo,
  reviewField,
} from '../content/evidenceUploadOther';

import { EVIDENCE_OTHER } from '../constants';

export default {
  uiSchema: {
    'ui:title': ' ',
    'ui:options': {
      forceDivWrapper: true,
    },
    [EVIDENCE_OTHER]: {
      'ui:title': evidenceUploadOtherHeader,
      'ui:widget': 'yesNo',
      'ui:reviewField': reviewField,
    },
    'view:otherEvidenceInfo': {
      'ui:description': evidenceUploadOtherInfo,
    },
  },
  schema: {
    type: 'object',
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
