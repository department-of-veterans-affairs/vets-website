import {
  ssnOrVaFileNumberSchema,
  ssnOrVaFileNumberUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Veteran’s identification information'),
    'ui:description':
      'You must enter either a Social Security number or a VA File number.',
    veteranSocialSecurityNumber: ssnOrVaFileNumberUI(),
  },
  schema: {
    type: 'object',
    required: ['veteranSocialSecurityNumber'],
    properties: {
      veteranSocialSecurityNumber: ssnOrVaFileNumberSchema,
    },
  },
};
