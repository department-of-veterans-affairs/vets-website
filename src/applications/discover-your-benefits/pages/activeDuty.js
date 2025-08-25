import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    titleTenActiveDuty: yesNoUI({
      enableAnalytics: true,
      title:
        'Were you ever called up to active-duty (Title 10) orders while serving in the National Guard or Reserves?',
      hint:
        'This includes activations, deployments, and mobilizations under Title 10 orders.',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      titleTenActiveDuty: yesNoSchema,
    },
  },
};
