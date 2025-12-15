import { HAS_PRIVATE_EVIDENCE } from '../../constants';

export default {
  uiSchema: {
    [HAS_PRIVATE_EVIDENCE]: {
      'ui:options': {
        hideOnReview: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      [HAS_PRIVATE_EVIDENCE]: {
        type: 'boolean',
      },
    },
    required: [HAS_PRIVATE_EVIDENCE],
  },
};
