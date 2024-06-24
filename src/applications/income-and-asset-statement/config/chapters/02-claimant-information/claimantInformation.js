import {
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  ssnUI,
  ssnSchema,
  phoneUI,
  phoneSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Claimant information',
  path: 'claimant/information',
  depends: formData => {
    return formData.applicantIsVeteran === false;
  },
  uiSchema: {
    claimantFullName: fullNameNoSuffixUI(title => `Claimant’s ${title}`),
    claimantSocialSecurityNumber: ssnUI('Claimants’s Social Security number'),
    claimantPhoneNumber: phoneUI('Claimants’s telephone number (if known)'),
  },
  schema: {
    type: 'object',
    required: ['claimantFullName', 'claimantSocialSecurityNumber'],
    properties: {
      claimantFullName: fullNameNoSuffixSchema,
      claimantSocialSecurityNumber: ssnSchema,
      claimantPhoneNumber: phoneSchema,
    },
  },
};
