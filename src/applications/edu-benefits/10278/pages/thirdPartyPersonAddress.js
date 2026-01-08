import {
  titleUI,
  addressUI,
  addressSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  thirdPartyPersonAddress: {
    ...titleUI('Address of person'),
    address: addressUI({
      omit: ['isMilitary'],
    }),
  },
};

const schema = {
  type: 'object',
  properties: {
    thirdPartyPersonAddress: {
      type: 'object',
      properties: {
        address: addressSchema({
          omit: ['isMilitary'],
        }),
      },
      required: ['address'],
    },
  },
};

export { uiSchema, schema };
