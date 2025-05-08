import {
  titleUI,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

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
