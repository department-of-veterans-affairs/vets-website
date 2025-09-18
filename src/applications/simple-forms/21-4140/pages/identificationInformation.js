import {
  titleUI,
  ssnOrVaFileNumberUI,
  ssnOrVaFileNumberSchema,
  serviceNumberUI,
  serviceNumberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Identification information'),
    veteranId: ssnOrVaFileNumberUI(),
    serviceNumber: serviceNumberUI('Military Service number'),
  },
  schema: {
    type: 'object',
    properties: {
      veteranId: ssnOrVaFileNumberSchema,
      serviceNumber: serviceNumberSchema,
    },
    required: ['veteranId'],
  },
};
