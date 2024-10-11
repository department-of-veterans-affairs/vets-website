import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    militaryServiceCompleted: yesNoUI({
      title: 'Have you ever completed a previous period of military service?',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      militaryServiceCompleted: yesNoSchema,
    },
  },
};
