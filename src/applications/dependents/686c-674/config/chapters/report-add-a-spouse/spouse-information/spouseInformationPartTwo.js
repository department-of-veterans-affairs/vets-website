import {
  ssnUI,
  ssnSchema,
  yesNoUI,
  yesNoSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export const schema = {
  type: 'object',
  properties: {
    spouseInformation: {
      type: 'object',
      properties: {
        ssn: ssnSchema,
        isVeteran: yesNoSchema,
      },
    },
  },
};

export const uiSchema = {
  spouseInformation: {
    ...titleUI('Spouse’s identification information'),
    ssn: {
      ...ssnUI('Spouse’s Social Security number'),
      'ui:required': () => true,
    },

    isVeteran: {
      ...yesNoUI('Is your spouse a Veteran?'),
      'ui:required': () => true,
    },
  },
};
