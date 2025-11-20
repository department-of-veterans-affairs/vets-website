import {
  textUI,
  textSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Relationship to spouse'),
    relationshipToSpouse: textUI({
      title: 'What was/is your relationship to the claimed spouse?',
      hint: "Parent, child, brother, sister, etc. If not related, state 'None'",
    }),
  },
  schema: {
    type: 'object',
    properties: {
      relationshipToSpouse: {
        ...textSchema,
        maxLength: 50,
      },
    },
    required: ['relationshipToSpouse'],
  },
};
