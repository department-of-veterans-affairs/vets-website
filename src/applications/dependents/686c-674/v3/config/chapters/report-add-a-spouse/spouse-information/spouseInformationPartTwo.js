import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const schema = {
  type: 'object',
  properties: {
    spouseInformation: {
      type: 'object',
      properties: {
        isVeteran: yesNoSchema,
      },
    },
  },
};

export const uiSchema = {
  spouseInformation: {
    isVeteran: {
      ...yesNoUI({
        title: 'Is your spouse a Veteran?',
        labelHeaderLevel: '3',
        required: () => true,
      }),
    },
  },
};
