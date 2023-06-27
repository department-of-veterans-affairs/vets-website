import {
  requestVaRecordsTitle,
  requestVaRecordsInfo,
} from '../content/evidenceVaRecordsRequest';

import { EVIDENCE_VA, errorMessages } from '../constants';

export default {
  uiSchema: {
    'ui:title': ' ',
    'ui:options': {
      forceDivWrapper: true,
    },
    [EVIDENCE_VA]: {
      'ui:title': requestVaRecordsTitle,
      'ui:widget': 'yesNo',
      'ui:errorMessages': {
        required: errorMessages.requiredYesNo,
      },
      'ui:options': {
        hideOnReview: true,
        enableAnalytics: true,
      },
    },
    'view:vaEvidenceInfo': {
      'ui:description': requestVaRecordsInfo,
    },
  },
  schema: {
    type: 'object',
    required: [EVIDENCE_VA],
    properties: {
      [EVIDENCE_VA]: {
        type: 'boolean',
      },
      'view:vaEvidenceInfo': {
        type: 'object',
        properties: {},
      },
    },
  },
};
