import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    militaryServiceCompleted: yesNoUI({
      enableAnalytics: true,
      title: 'Have you ever completed a previous period of military service?',
      hint:
        'This includes active-duty service and service in the National Guard and Reserves.',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      militaryServiceCompleted: yesNoSchema,
    },
  },
};
