import {
  textUI,
  textSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Contact with claimed spouse'),
    visitFrequency: textUI('How often have you visited your claimed spouse?'),
    visitOccasions: textUI(
      'On what occasions have you met your claimed spouse?',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      visitFrequency: textSchema,
      visitOccasions: textSchema,
    },
    required: [],
  },
};
