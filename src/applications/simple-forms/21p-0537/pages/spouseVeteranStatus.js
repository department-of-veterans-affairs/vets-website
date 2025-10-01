import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

// Spouse Veteran status question
const spouseVeteranUI = yesNoUI();
spouseVeteranUI['ui:title'] = 'Is your spouse a Veteran?';
spouseVeteranUI['ui:required'] = () => true;

export default {
  uiSchema: {
    hideFormTitle: true,
    remarriage: {
      spouseIsVeteran: spouseVeteranUI,
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
