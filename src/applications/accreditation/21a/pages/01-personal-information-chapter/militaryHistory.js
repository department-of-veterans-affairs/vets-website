import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Military history',
  path: 'military-history',
  uiSchema: {
    ...titleUI('Military history'),
    militaryHistory: yesNoUI({
      title: 'Are you a Veteran?',
      labels: { Y: 'Yes, I am a Veteran', N: 'No, I am a civilian' },
    }),
  },
  schema: {
    type: 'object',
    required: ['militaryHistory'],
    properties: {
      militaryHistory: yesNoSchema,
    },
  },
};
