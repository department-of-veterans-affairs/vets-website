import {
  textUI,
  textSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('First name used by spouse'),
    usedFirstName: textUI('First name by which spouse was/is known'),
  },
  schema: {
    type: 'object',
    properties: {
      usedFirstName: {
        ...textSchema,
        maxLength: 50,
      },
    },
    required: ['usedFirstName'],
  },
};
