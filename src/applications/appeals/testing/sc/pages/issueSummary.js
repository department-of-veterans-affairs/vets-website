import IssueSummary from '../content/IssueSummary';

export default {
  uiSchema: {
    'ui:title': IssueSummary,
    'ui:options': {
      forceDivWrapper: true,
      hideOnReview: true,
    },
  },

  schema: {
    type: 'object',
    properties: {},
  },
};
