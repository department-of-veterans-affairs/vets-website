import {
  Notice5103Description,
  content,
  reviewField,
} from '../content/notice5103';

export default {
  uiSchema: {
    'ui:description': Notice5103Description,
    form5103Acknowledged: {
      'ui:title': content.label,
      'ui:required': () => true,
      'ui:errorMessages': {
        enum: content.error,
      },
      'ui:reviewField': reviewField,
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
