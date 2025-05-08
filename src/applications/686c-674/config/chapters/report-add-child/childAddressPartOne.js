import {
  addressUI,
  addressSchema,
  titleUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

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
