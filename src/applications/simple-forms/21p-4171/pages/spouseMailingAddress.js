import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Your mailing address'),
    spouseAddress: addressUI(),
  },
  schema: {
    type: 'object',
    properties: {
      spouseAddress: addressSchema(),
    },
    required: [],
  },
};
