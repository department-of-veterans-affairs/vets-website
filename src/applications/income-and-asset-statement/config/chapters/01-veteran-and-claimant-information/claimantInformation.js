import {
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  ssnUI,
  ssnSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Claimant information',
  path: 'claimant/information',
  depends: formData => {
    return formData?.claimantType !== 'VETERAN';
  },
  uiSchema: {
    ...titleUI('Claimant information'),
    claimantFullName: fullNameNoSuffixUI(title => `Your ${title}`),
    claimantSocialSecurityNumber: ssnUI('Your Social Security number'),
  },
  schema: {
    type: 'object',
    required: ['claimantFullName', 'claimantSocialSecurityNumber'],
    properties: {
      claimantFullName: fullNameNoSuffixSchema,
      claimantSocialSecurityNumber: ssnSchema,
    },
  },
};
