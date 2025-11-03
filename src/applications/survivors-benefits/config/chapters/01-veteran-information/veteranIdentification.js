import {
  ssnUI,
  ssnSchema,
  vaFileNumberUI,
  vaFileNumberSchema,
  serviceNumberUI,
  serviceNumberSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Veteran’s identification information'),
    veteranSocialSecurityNumber: ssnUI(),
    veteranVAFileNumber: vaFileNumberUI(),
    veteranServiceNumber: serviceNumberUI('Service number'),
  },
  schema: {
    type: 'object',
    required: ['veteranSocialSecurityNumber'],
    properties: {
      veteranSocialSecurityNumber: ssnSchema,
      veteranVAFileNumber: vaFileNumberSchema,
      veteranServiceNumber: serviceNumberSchema,
    },
  },
};
