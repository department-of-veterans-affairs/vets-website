import {
  fullNameUI,
  fullNameSchema,
  ssnUI,
  ssnSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Claimant information',
  path: 'claimant/information',
  depends: formData => {
    return formData.applicantIsVeteran === false;
  },
  uiSchema: {
    claimantFullName: fullNameUI(title => `Claimant’s ${title}`),
    claimantSocialSecurityNumber: ssnUI('Claimants’s Social Security number'),
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
