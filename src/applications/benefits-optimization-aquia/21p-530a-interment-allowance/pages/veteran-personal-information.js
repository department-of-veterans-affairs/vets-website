import {
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const veteranPersonalInformationPage = {
  uiSchema: {
    veteranInformation: {
      fullName: fullNameNoSuffixUI(),
    },
  },
  schema: {
    type: 'object',
    properties: {
      veteranInformation: {
        type: 'object',
        required: ['fullName'],
        properties: {
          fullName: fullNameNoSuffixSchema,
        },
      },
    },
  },
};
