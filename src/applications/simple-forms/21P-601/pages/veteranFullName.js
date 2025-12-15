import {
  titleUI,
  fullNameUI,
  fullNameSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI("Veteran's name"),
    veteranFullName: fullNameUI(),
  },
  schema: {
    type: 'object',
    required: ['veteranFullName'],
    properties: {
      veteranFullName: fullNameSchema,
    },
  },
};
