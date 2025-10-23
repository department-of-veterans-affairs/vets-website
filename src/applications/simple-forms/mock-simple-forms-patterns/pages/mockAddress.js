import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Web component v3 address'),
    wcv3Address: addressUI(),
  },
  schema: {
    type: 'object',
    properties: {
      wcv3Address: addressSchema(),
    },
    required: [],
  },
};
