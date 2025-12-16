// @ts-check
import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI(
    'Mailing address',
    'We’ll send any important information about your form to this address.',
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
};

export { schema, uiSchema };
