import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
/** @type {PageSchema} */
export const isVeteranPage = {
  uiSchema: {
    ...titleUI('Tell us who the claimant is'),
    isVeteran: {
      ...yesNoUI('Is the claimant also the veteran?'),
      'ui:required': () => true,
    },
  },
  schema: {
    type: 'object',
    properties: {
      isVeteran: yesNoSchema,
    },
  },
};
