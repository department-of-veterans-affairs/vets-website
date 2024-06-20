import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Bar standing',
  path: 'bar-standing',
  uiSchema: {
    barStanding: yesNoUI({
      title:
        'Are you currently a member in good standing of the bar of the highest court of a state or territory of the United States?',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      barStanding: yesNoSchema,
    },
    required: ['barStanding'],
  },
};
