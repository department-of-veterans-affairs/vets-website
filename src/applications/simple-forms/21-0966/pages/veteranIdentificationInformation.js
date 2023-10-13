import {
  titleSchema,
  titleUI,
  ssnOrVaFileNumberSchema,
  ssnOrVaFileNumberUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Veteran’s identification information'),
    veteranId: ssnOrVaFileNumberUI(),
  },
  schema: {
    type: 'object',
    properties: {
      'view:title': titleSchema,
      veteranId: ssnOrVaFileNumberSchema,
    },
  },
};
