// @ts-check
import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Mailing address',
      'We’ll send any important information about your form to this address.',
    ),
    mailingAddress: {
      ...addressUI(),
    },
  },
  schema: {
    type: 'object',
    properties: {
      mailingAddress: addressSchema(),
    },
  },
};
