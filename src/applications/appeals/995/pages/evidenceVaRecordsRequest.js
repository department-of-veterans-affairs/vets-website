import {
  requestVaRecordsTitle,
  requestVaRecordsInfo,
} from '../content/evidenceVaRecordsRequest';

export default {
  uiSchema: {
    'ui:title': ' ',
    'ui:options': {
      forceDivWrapper: true,
    },
    'view:hasVaEvidence': {
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
      'view:hasVaEvidence': {
        type: 'boolean',
      },
      'view:vaEvidenceInfo': {
        type: 'object',
        properties: {},
      },
    },
  },
};
