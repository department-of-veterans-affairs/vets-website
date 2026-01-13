import {
  numberUI,
  numberSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Dependents to report'),
    veteranChildrenCount: {
      ...numberUI({
        title: 'How many dependent children do you have?',
        min: 0,
        max: 99,
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['veteranChildrenCount'],
    properties: {
      veteranChildrenCount: numberSchema,
    },
  },
};
