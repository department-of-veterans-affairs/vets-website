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
    'ui:options': {
      updateSchema: (formData, formSchema, _uiSchema, index) => {
        if (formData?.childrenToAdd?.[index]?.doesChildLiveWithYou === false) {
          return {
            ...formSchema,
            required: ['livingWith'],
          };
        }
        return formSchema;
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      livingWith: fullNameNoSuffixSchema,
    },
  },
};
