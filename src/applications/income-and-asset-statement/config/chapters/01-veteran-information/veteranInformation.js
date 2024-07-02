import {
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  ssnUI,
  ssnSchema,
  vaFileNumberUI,
  vaFileNumberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Veteran information',
  path: 'veteran/information',
  uiSchema: {
    veteranFullName: fullNameNoSuffixUI(title => `Veteran’s ${title}`),
    veteranSocialSecurityNumber: ssnUI('Veteran’s Social Security number'),
    vaFileNumber: vaFileNumberUI('Veteran’s file number'),
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
