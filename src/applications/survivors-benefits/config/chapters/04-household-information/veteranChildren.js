import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Children of Veteran'),
    pregnantWithVeteran: yesNoUI({
      title: "Are you expecting the birth of the Veteran's child?",
    }),
    childWithVeteran: yesNoUI({
      title:
        'Did you have a child with the Veteran before or during your marriage?',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      pregnantWithVeteran: yesNoSchema,
      childWithVeteran: yesNoSchema,
    },
    required: ['pregnantWithVeteran', 'childWithVeteran'],
  },
};
