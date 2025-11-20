import {
  textareaUI,
  textareaSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Occasions you met the spouse'),
    visitOccasionsSpouse: textareaUI({
      title: 'On what occasions have you met the claimed spouse?',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      visitOccasionsSpouse: {
        ...textareaSchema,
        maxLength: 500,
      },
    },
    required: ['visitOccasionsSpouse'],
  },
};
