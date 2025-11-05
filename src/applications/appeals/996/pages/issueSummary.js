import { SummaryTitle } from '../content/issueSummary';

// This file is tested in /shared/tests/pages/issueSummary.unit.spec.jsx
export default {
  uiSchema: {
    'ui:title': SummaryTitle,
    'ui:options': {
      forceDivWrapper: true,
    },
  },

  schema: {
    type: 'object',
    properties: {},
  },
};
