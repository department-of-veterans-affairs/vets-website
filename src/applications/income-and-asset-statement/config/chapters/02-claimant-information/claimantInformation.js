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
    return formData['view:applicantIsVeteran'] === false;
  },
  uiSchema: {
    claimantFullName: fullNameNoSuffixUI(title => `Claimant’s ${title}`),
    claimantSocialSecurityNumber: ssnUI('Claimant’s Social Security number'),
    claimantPhone: phoneUI('Claimant’s telephone number (if known)'),
  },
  schema: {
    type: 'object',
    required: ['claimantFullName', 'claimantSocialSecurityNumber'],
    properties: {
      claimantFullName: fullNameNoSuffixSchema,
      claimantSocialSecurityNumber: ssnSchema,
      claimantPhone: phoneSchema,
    },
  },
};
