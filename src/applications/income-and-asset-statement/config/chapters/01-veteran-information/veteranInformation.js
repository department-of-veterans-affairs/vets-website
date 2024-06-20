import {
  fullNameUI,
  fullNameSchema,
  ssnUI,
  ssnSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Veteran information',
  path: 'veteran/information',
  uiSchema: {
    veteranFullName: fullNameUI(title => `Veteran’s ${title}`),
    veteranSocialSecurityNumber: ssnUI('Veteran’s Social Security number'),
  },
  schema: {
    type: 'object',
    required: ['veteranFullName', 'veteranSocialSecurityNumber'],
    properties: {
      veteranFullName: fullNameSchema,
      veteranSocialSecurityNumber: ssnSchema,
    },
  },
};
