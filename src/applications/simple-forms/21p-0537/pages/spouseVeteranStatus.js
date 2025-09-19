import {
  yesNoUI,
  yesNoSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

// Spouse veteran status question
const spouseVeteranUI = yesNoUI();
spouseVeteranUI['ui:title'] = 'Is your spouse a Veteran?';
spouseVeteranUI['ui:required'] = () => true;

export default {
  uiSchema: {
    ...titleUI('Is your spouse a Veteran?'),
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
