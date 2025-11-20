import {
  fullNameSchema,
  fullNameUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI("Veteran's name"),
    veteranFullName: fullNameUI(),
  },
  schema: {
    type: 'object',
    properties: {
      veteranFullName: fullNameSchema,
    },
    required: ['veteranFullName'],
  },
};
