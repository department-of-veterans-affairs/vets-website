import {
  yesNoSchema,
  yesNoUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Marriage to Veteran'),
    marriedAtDeath: yesNoUI({
      title: 'Were you married to the Veteran at the time of their death?',
    }),
  },
  schema: {
    type: 'object',
    required: ['marriedAtDeath'],
    properties: {
      marriedAtDeath: yesNoSchema,
    },
  },
};
