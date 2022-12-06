import {
  acknowledge5103Description,
  acknowledge5103Label,
  acknowledge5103Error,
} from '../content/noticeOfAcknowledgement';

export default {
  uiSchema: {
    'ui:description': acknowledge5103Description,
    'ui:options': {
      forceDivWrapper: true,
    },
    form5103Acknowledged: {
      'ui:widget': 'checkbox',
      'ui:title': acknowledge5103Label,
      'ui:required': () => true,
      'ui:errorMessages': {
        enum: acknowledge5103Error,
      },
      'ui:options': {
        forceDivWrapper: true,
        keepInPageOnReview: false,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      form5103Acknowledged: {
        type: 'boolean',
        enum: [true],
      },
    },
  },
};
