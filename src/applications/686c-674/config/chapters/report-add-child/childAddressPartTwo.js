import {
  titleUI,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const childAddressPartTwo = {
  uiSchema: {
    ...titleUI({
      title: 'Who does this child live with?',
    }),
    livingWith: fullNameNoSuffixUI(),
  },
  schema: {
    type: 'object',
    properties: {
      livingWith: fullNameNoSuffixSchema,
    },
  },
};
