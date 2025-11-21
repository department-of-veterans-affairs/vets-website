import {
  textUI,
  textSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Last name used by spouse'),
    usedLastName: textUI('Last name by which spouse was/is known'),
  },
  schema: {
    type: 'object',
    properties: {
      usedLastName: {
        ...textSchema,
        maxLength: 50,
      },
    },
    required: ['usedLastName'],
  },
};
