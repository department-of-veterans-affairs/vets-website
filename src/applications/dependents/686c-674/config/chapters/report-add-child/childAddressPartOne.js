import {
  addressUI,
  addressSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export const childAddressPartOne = {
  uiSchema: {
    ...titleUI({
      title: 'Child’s address',
    }),
    address: {
      ...addressUI(),
    },
  },
  schema: {
    type: 'object',
    properties: {
      address: addressSchema(),
    },
  },
};
