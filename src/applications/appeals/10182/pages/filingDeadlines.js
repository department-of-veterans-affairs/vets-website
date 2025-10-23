import { FilingDeadlinesDescription } from '../content/FilingDeadlines';

export default {
  uiSchema: {
    'ui:title': ' ',
    'ui:description': FilingDeadlinesDescription,
    'ui:options': {
      forceDivWrapper: true,
    },
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
