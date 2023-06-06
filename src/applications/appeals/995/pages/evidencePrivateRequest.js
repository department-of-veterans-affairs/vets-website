import {
  privateRecordsRequestTitle,
  privateRecordsRequestInfo,
} from '../content/evidencePrivateRecordsRequest';
import { EVIDENCE_PRIVATE } from '../constants';

export default {
  uiSchema: {
    'ui:description': privateRecordsRequestInfo,
    'ui:options': {
      forceDivWrapper: true,
    },
    [EVIDENCE_PRIVATE]: {
      'ui:title': privateRecordsRequestTitle,
      'ui:options': {
        forceDivWrapper: true,
        hideOnReview: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      [EVIDENCE_PRIVATE]: {
        type: 'boolean',
      },
    },
    required: [EVIDENCE_PRIVATE],
  },
};
