import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export const uiSchema = {
  ...titleUI('Veteran’s mailing address'),
  homeAddress: addressUI(),
};

export const schema = {
  type: 'object',
  properties: {
    homeAddress: addressSchema({
      omit: ['street3'],
    }),
  },
};
