import {
  titleUI,
  addressUI,
  addressSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Address'),
    address: addressUI(),
  },
  schema: {
    type: 'object',
    properties: {
      address: addressSchema(),
    },
    required: ['address'],
  },
};
