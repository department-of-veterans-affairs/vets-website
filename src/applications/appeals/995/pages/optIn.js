import { optInDescription, optInLabel, reviewField } from '../content/optIn';

export default {
  uiSchema: {
    'ui:description': optInDescription,
    'ui:options': {
      forceDivWrapper: true,
    },
    socOptIn: {
      'ui:title': optInLabel,
      'ui:options': {
        forceDivWrapper: true,
        keepInPageOnReview: false,
      },
      'ui:reviewField': reviewField,
    },
  },
  schema: {
    type: 'object',
    properties: {
      socOptIn: {
        type: 'boolean',
      },
    },
  },
};
