import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    remarriage: {
      spouseIsVeteran: yesNoUI({
        title: 'Is your spouse a Veteran?',
        labelHeaderLevel: '3',
        required: () => true,
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      remarriage: {
        type: 'object',
        required: ['spouseIsVeteran'],
        properties: {
          spouseIsVeteran: yesNoSchema,
        },
      },
    },
  },
};
