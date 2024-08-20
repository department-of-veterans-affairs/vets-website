import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export const uiSchema = {
  ...titleUI(
    'Your mailing address',
    'We’ll send any important information about your form to this address.',
  ),
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
