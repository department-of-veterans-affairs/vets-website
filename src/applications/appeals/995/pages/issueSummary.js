import IssueSummary from '../content/IssueSummary';

// This file is tested in /shared/tests/pages/issueSummary.unit.spec.jsx
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
