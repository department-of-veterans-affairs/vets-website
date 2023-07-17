import { homelessTitle, homelessReviewField } from '../content/homeless';

export default {
  uiSchema: {
    'ui:title': ' ',
    'ui:options': {
      forceDivWrapper: true,
    },
    homeless: {
      'ui:title': homelessTitle,
      'ui:reviewField': homelessReviewField,
      'ui:widget': 'yesNo',
      'ui:options': {
        enableAnalytics: true,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['homeless'],
    properties: {
      homeless: {
        type: 'boolean',
      },
    },
  },
};
