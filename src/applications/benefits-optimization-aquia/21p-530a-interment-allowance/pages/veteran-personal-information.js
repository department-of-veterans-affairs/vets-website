import {
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const veteranPersonalInformationPage = {
  uiSchema: {
    veteranFullName: fullNameNoSuffixUI(),
  },
  schema: {
    type: 'object',
    required: ['veteranFullName'],
    properties: {
      veteranFullName: fullNameNoSuffixSchema,
    },
  },
};
