import {
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  ssnUI,
  ssnSchema,
  vaFileNumberUI,
  vaFileNumberSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Veteran information',
  path: 'veteran/information',
  depends: formData => {
    const hasSession = localStorage.getItem('hasSession') === 'true';
    return !(formData?.claimantType === 'VETERAN' && hasSession);
  },
  uiSchema: {
    ...titleUI('Veteran information'),
    veteranFullName: fullNameNoSuffixUI(),
    veteranSocialSecurityNumber: ssnUI('Social Security number'),
    vaFileNumber: vaFileNumberUI('File number'),
  },
  schema: {
    type: 'object',
    required: ['veteranFullName', 'veteranSocialSecurityNumber'],
    properties: {
      veteranFullName: fullNameNoSuffixSchema,
      veteranSocialSecurityNumber: ssnSchema,
      vaFileNumber: vaFileNumberSchema,
    },
  },
};
