import {
  requestVaRecordsTitle,
  requestVaRecordsInfo,
} from '../content/evidenceVaRecordsRequest';

import { EVIDENCE_VA } from '../constants';

export default {
  uiSchema: {
    'ui:title': ' ',
    'ui:options': {
      forceDivWrapper: true,
    },
    [EVIDENCE_VA]: {
      'ui:title': requestVaRecordsTitle,
      'ui:widget': 'yesNo',
    },
    'view:vaEvidenceInfo': {
      'ui:description': requestVaRecordsInfo,
    },
  },
  schema: {
    type: 'object',
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
