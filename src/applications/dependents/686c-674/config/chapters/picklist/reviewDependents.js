import { ReviewDependents } from '../../../components/ReviewDependents';

export default {
  uiSchema: {
    'view:reviewDependents': {
      'ui:description': ReviewDependents,
    },
  },

  schema: {
    type: 'object',
    properties: {
      'view:reviewDependents': {
        type: 'object',
        properties: {},
      },
    },
  },
};
