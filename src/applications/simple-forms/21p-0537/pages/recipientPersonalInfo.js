import {
  titleUI,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Your information'),
    recipientName: fullNameNoSuffixUI(),
  },
  schema: {
    type: 'object',
    required: ['recipientName'],
    properties: {
      recipientName: fullNameNoSuffixSchema,
    },
  },
};
