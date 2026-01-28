import {
  arrayBuilderItemSubsequentPageTitleUI,
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'Name of organization’s representatives',
    ),
    fullName: fullNameNoSuffixUI(),
  },

  schema: {
    type: 'object',
    properties: {
      fullName: fullNameNoSuffixSchema,
    },
    required: ['fullName'],
  },
};
