import {
  titleUI,
  ssnUI,
  ssnSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Claimant’s identification information'),
    claimantSocialSecurityNumber: ssnUI(),
  },
  schema: {
    type: 'object',
    required: ['claimantSocialSecurityNumber'],
    properties: {
      claimantSocialSecurityNumber: ssnSchema,
    },
  },
};
