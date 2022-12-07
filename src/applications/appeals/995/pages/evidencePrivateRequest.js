import {
  privateRecordsRequestTitle,
  privateRecordsRequestInfo,
  reviewField,
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
        keepInPageOnReview: false,
      },
      'ui:reviewField': reviewField,
    },
  },
  schema: {
    type: 'object',
    properties: {
      [EVIDENCE_PRIVATE]: {
        type: 'boolean',
      },
    },
  },
};
