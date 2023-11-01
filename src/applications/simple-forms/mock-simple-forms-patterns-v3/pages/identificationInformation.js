import {
  titleUI,
  ssnOrVaFileNumberSchema,
  ssnOrVaFileNumberUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Identification information'),
    veteranId: ssnOrVaFileNumberUI(),
  },
  schema: {
    type: 'object',
    properties: {
      veteranId: ssnOrVaFileNumberSchema,
    },
  },
};
