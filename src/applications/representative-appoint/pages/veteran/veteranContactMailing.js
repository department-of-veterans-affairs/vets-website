import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { preparerIsVeteran } from '../../utilities/helpers';

export const uiSchema = {
  ...titleUI(`${preparerIsVeteran ? 'Veteran’s' : 'Your'} mailing address`),
  veteranHomeAddress: addressUI({
    labels: {
      militaryCheckbox: `${
        preparerIsVeteran ? 'The Veteran lives' : 'I live'
      } on a United States military base outside of the U.S.`,
    },
  }),
};

export const schema = {
  type: 'object',
  properties: {
    veteranHomeAddress: addressSchema({
      omit: ['street3'],
    }),
  },
};
