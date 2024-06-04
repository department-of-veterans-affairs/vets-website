import {
  fullNameUI,
  fullNameSchema,
  ssnUI,
  ssnSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Applicant information',
  path: 'applicant/information',
  uiSchema: {
    veteranFullName: fullNameUI(),
    veteranSocialSecurityNumber: ssnUI(),
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
