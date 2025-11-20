import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Children of Veteran'),
    expectingChild: yesNoUI({
      title: "Are you expecting the birth of the Veteran's child?",
    }),
    hadChildWithVeteran: yesNoUI({
      title:
        'Did you have a child with the Veteran before or during your marriage?',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      expectingChild: yesNoSchema,
      hadChildWithVeteran: yesNoSchema,
    },
    required: ['expectingChild', 'hadChildWithVeteran'],
  },
};
