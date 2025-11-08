import {
  ssnOrVaFileNumberUI,
  ssnOrVaFileNumberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const veteranIdentificationPage = {
  uiSchema: {
    veteranInformation: ssnOrVaFileNumberUI(),
  },
  schema: {
    type: 'object',
    required: ['veteranInformation'],
    properties: {
      veteranInformation: ssnOrVaFileNumberSchema,
    },
  },
};
