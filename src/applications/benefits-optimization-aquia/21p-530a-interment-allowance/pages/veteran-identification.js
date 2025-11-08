import {
  ssnOrVaFileNumberUI,
  ssnOrVaFileNumberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const veteranIdentificationPage = {
  uiSchema: {
    veteranIdentification: ssnOrVaFileNumberUI(),
  },
  schema: {
    type: 'object',
    required: ['veteranIdentification'],
    properties: {
      veteranIdentification: ssnOrVaFileNumberSchema,
    },
  },
};
