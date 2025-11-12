import {
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export const veteranPersonalInformationPage = {
  uiSchema: {
    ...titleUI("Veteran's name"),
    veteranInformation: {
      fullName: {
        ...fullNameNoSuffixUI(),
        first: {
          ...fullNameNoSuffixUI().first,
          'ui:title': 'First or given name',
        },
        middle: {
          ...fullNameNoSuffixUI().middle,
          'ui:title': 'Middle initial',
        },
        last: {
          ...fullNameNoSuffixUI().last,
          'ui:title': 'Last or family name',
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      veteranInformation: {
        type: 'object',
        required: ['fullName'],
        properties: {
          fullName: {
            ...fullNameNoSuffixSchema,
            properties: {
              ...fullNameNoSuffixSchema.properties,
              middle: {
                ...fullNameNoSuffixSchema.properties.middle,
                maxLength: 1,
              },
            },
          },
        },
      },
    },
  },
};
