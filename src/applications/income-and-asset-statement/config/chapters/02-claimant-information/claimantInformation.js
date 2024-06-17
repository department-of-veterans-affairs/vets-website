import {
  fullNameUI,
  fullNameSchema,
  ssnUI,
  ssnSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Claimant information',
  path: 'claimant/information',
  depends: formData => {
    return formData.applicantIsVeteran === false;
  },
  uiSchema: {
    ...titleUI('Claimant information'),
    claimantFullName: fullNameUI(),
    claimantSocialSecurityNumber: ssnUI(),
  },
  schema: {
    type: 'object',
    required: ['claimantFullName', 'claimantSocialSecurityNumber'],
    properties: {
      claimantFullName: fullNameSchema,
      claimantSocialSecurityNumber: ssnSchema,
    },
  },
};
