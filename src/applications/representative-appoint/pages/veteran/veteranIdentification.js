import {
  ssnUI,
  ssnSchema,
  vaFileNumberUI,
  vaFileNumberSchema,
  serviceNumberUI,
  serviceNumberSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { preparerIsVeteran } from '../../utilities/helpers';

/** @type {PageSchema} */

export const uiSchema = {
  ...titleUI(
    `${preparerIsVeteran ? 'Veteran’s' : 'Your'} identification information`,
  ),
  veteranSocialSecurityNumber: ssnUI('Social Security number'),
  veteranVAFileNumber: vaFileNumberUI('VA file number'),
  veteranServiceNumber: serviceNumberUI('Service Number'),
};

export const schema = {
  type: 'object',
  required: ['veteranSocialSecurityNumber'],
  properties: {
    veteranSocialSecurityNumber: ssnSchema,
    veteranVAFileNumber: vaFileNumberSchema,
    veteranServiceNumber: serviceNumberSchema,
  },
};
