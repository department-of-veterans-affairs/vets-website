import { EVIDENCE_PRIVATE } from '../constants';

export default {
  uiSchema: {
    [EVIDENCE_PRIVATE]: {
      'ui:options': {
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
