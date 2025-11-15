import { HAS_VA_EVIDENCE } from '../../constants';

export const title =
  'Do you want us to get your VA medical records or military health records?';

export default {
  uiSchema: {
    [HAS_VA_EVIDENCE]: {
      'ui:options': {
        hideOnReview: true,
      },
    },
  },
  schema: {
    type: 'object',
    required: [HAS_VA_EVIDENCE],
    properties: {
      [HAS_VA_EVIDENCE]: {
        type: 'boolean',
      },
      'view:vaEvidenceInfo': {
        type: 'object',
        properties: {},
      },
    },
  },
};
