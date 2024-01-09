import {
  addressUI,
  addressSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Spouse address',
    spouseAddress: addressUI({
      omit: ['isMilitary', 'street3'],
    }),
  },
  schema: {
    type: 'object',
    required: ['spouseAddress'],
    properties: {
      spouseAddress: addressSchema({ omit: ['isMilitary', 'street3'] }),
    },
  },
};
