import {
  yesNoSchema,
  yesNoUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Marriage to Veteran'),
    marriedToVeteranAtTimeOfDeath: yesNoUI({
      title: 'Were you married to the Veteran at the time of their death?',
    }),
  },
  schema: {
    type: 'object',
    required: ['marriedToVeteranAtTimeOfDeath'],
    properties: {
      marriedToVeteranAtTimeOfDeath: yesNoSchema,
    },
  },
};
