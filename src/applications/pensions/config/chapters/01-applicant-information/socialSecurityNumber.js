import {
  ssnUI,
  ssnSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Social Security number'),
    veteranSocialSecurityNumber: ssnUI(),
  },
  schema: {
    type: 'object',
    required: ['veteranSocialSecurityNumber'],
    properties: {
      veteranSocialSecurityNumber: ssnSchema,
    },
  },
};
