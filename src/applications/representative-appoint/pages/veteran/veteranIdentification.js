import {
  ssnUI,
  ssnSchema,
  vaFileNumberUI,
  vaFileNumberSchema,
  serviceNumberUI,
  serviceNumberSchema,
  titleUI,
  titleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { preparerIsVeteran } from '../../utilities/helpers';

/** @type {PageSchema} */

export const uiSchema = {
  ...titleUI(
    ({ formData }) =>
      `${
        preparerIsVeteran({ formData }) ? 'Your' : 'Veteran’s'
      } identification information`,
  ),
  veteranSocialSecurityNumber: ssnUI('Social Security number'),
  veteranVAFileNumber: vaFileNumberUI('VA file number'),
  veteranServiceNumber: serviceNumberUI('Service Number'),
};

export const schema = {
  type: 'object',
  required: ['veteranSocialSecurityNumber'],
  properties: {
    titleSchema,
    veteranSocialSecurityNumber: ssnSchema,
    veteranVAFileNumber: vaFileNumberSchema,
    veteranServiceNumber: serviceNumberSchema,
  },
};
