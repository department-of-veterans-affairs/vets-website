import { EVIDENCE_PRIVATE } from '../constants';

export default {
  uiSchema: {},

  schema: {
    type: 'object',
    properties: {
      [EVIDENCE_PRIVATE]: {
        type: 'boolean',
      },
    },
  },
};
