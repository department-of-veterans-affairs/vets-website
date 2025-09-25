import {
  addressSchema,
  addressUI,
  descriptionUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI('Mailing address'),
  ...descriptionUI(
    "We'll send any important information about your application to this address.",
  ),
  mailingAddress: {
    ...addressUI(),
  },
};

const schema = {
  type: 'object',
  properties: {
    mailingAddress: addressSchema(),
  },
  required: ['mailingAddress'],
};

export { schema, uiSchema };
