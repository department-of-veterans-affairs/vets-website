import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Witness information'),
    witnessAddress: addressUI(),
  },
  schema: {
    type: 'object',
    properties: {
      witnessAddress: addressSchema(),
    },
    required: [],
  },
};
