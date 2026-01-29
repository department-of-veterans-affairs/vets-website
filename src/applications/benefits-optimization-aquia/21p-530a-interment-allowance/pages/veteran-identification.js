import {
  ssnOrVaFileNumberUI,
  ssnOrVaFileNumberSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export const veteranIdentificationPage = {
  uiSchema: {
    ...titleUI('Veteran’s identification information'),
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
