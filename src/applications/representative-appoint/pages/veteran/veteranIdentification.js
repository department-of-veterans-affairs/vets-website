import {
  ssnUI,
  ssnSchema,
  vaFileNumberUI,
  vaFileNumberSchema,
  serviceNumberUI,
  serviceNumberSchema,
  titleUI,
  titleSchema,
  descriptionUI,
  descriptionSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */

export const uiSchema = {
  ...titleUI('identification information'),
  ...descriptionUI('VA file numbers are the same.'),
  veteranSocialSecurityNumber: ssnUI('Social Security number'),
  veteranVAFileNumber: vaFileNumberUI('VA file number'),
  veteranServiceNumber: serviceNumberUI('Service Number'),
};

export const schema = {
  type: 'object',
  required: ['veteranSocialSecurityNumber'],
  properties: {
    titleSchema,
    descriptionSchema,
    veteranSocialSecurityNumber: ssnSchema,
    veteranVAFileNumber: {
      ...vaFileNumberSchema,
      maxLength: 9,
    },
    veteranServiceNumber: {
      ...serviceNumberSchema,
      maxLength: 9,
    },
  },
};
