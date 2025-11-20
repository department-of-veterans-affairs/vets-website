import {
  textUI,
  textSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Relationship to Veteran'),
    relationshipToVeteran: textUI({
      title: 'What was/is your relationship to the Veteran?',
      hint: "Parent, child, brother, sister, etc. If not related, state 'None'",
    }),
  },
  schema: {
    type: 'object',
    properties: {
      relationshipToVeteran: {
        ...textSchema,
        maxLength: 50,
      },
    },
    required: ['relationshipToVeteran'],
  },
};
