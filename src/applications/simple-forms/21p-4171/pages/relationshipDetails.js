import {
  textUI,
  textSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Relationship information'),
    witness: {
      relationshipToVeteran: textUI({
        title: 'What was/is your relationship to the Veteran?',
        hint:
          "Parent, child, brother, sister, etc. If not related, state 'None'",
      }),
      relationshipToSpouse: textUI({
        title: 'What was/is your relationship to the claimed spouse?',
        hint:
          "Parent, child, brother, sister, etc. If not related, state 'None'",
      }),
      howLongKnownVeteran: textUI({
        title: 'How long had/have you known the Veteran?',
        hint: 'Months, years',
      }),
      howLongKnownSpouse: textUI({
        title: 'How long had/have you known the claimed spouse?',
        hint: 'Months, years',
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      witness: {
        type: 'object',
        properties: {
          relationshipToVeteran: {
            ...textSchema,
            maxLength: 50,
          },
          relationshipToSpouse: {
            ...textSchema,
            maxLength: 50,
          },
          howLongKnownVeteran: {
            ...textSchema,
            maxLength: 20,
          },
          howLongKnownSpouse: {
            ...textSchema,
            maxLength: 20,
          },
        },
        required: [
          'relationshipToVeteran',
          'relationshipToSpouse',
          'howLongKnownVeteran',
          'howLongKnownSpouse',
        ],
      },
    },
    required: ['witness'],
  },
};
