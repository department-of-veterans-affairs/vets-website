import {
  textUI,
  textSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Names used by spouse'),
    spouse: {
      usedFirstName: textUI('First name by which spouse was/is known'),
      usedLastName: textUI('Last name by which spouse was/is known'),
    },
  },
  schema: {
    type: 'object',
    properties: {
      spouse: {
        type: 'object',
        properties: {
          usedFirstName: {
            ...textSchema,
            maxLength: 50,
          },
          usedLastName: {
            ...textSchema,
            maxLength: 50,
          },
        },
        required: ['usedFirstName', 'usedLastName'],
      },
    },
    required: ['spouse'],
  },
};
