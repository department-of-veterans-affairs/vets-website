import {
  addressSchema,
  addressUI,
  titleUI,
  titleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { preparerIsVeteran } from '../../utilities/helpers';

export const uiSchema = {
  ...titleUI(
    ({ formData }) =>
      `${
        preparerIsVeteran({ formData }) ? 'Your' : 'Veteran’s'
      }  mailing address`,
  ),
  veteranHomeAddress: addressUI({
    labels: {
      militaryCheckbox: `This address is on a United States military base outside of the U.S.`,
    },
  }),
};

export const schema = {
  type: 'object',
  properties: {
    titleSchema,
    veteranHomeAddress: addressSchema({
      omit: ['street3'],
    }),
  },
};
