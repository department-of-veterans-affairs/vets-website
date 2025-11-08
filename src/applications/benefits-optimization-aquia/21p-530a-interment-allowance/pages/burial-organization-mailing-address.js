import {
  addressUI,
  addressSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const burialOrganizationMailingAddressPage = {
  uiSchema: {
    burialInformation: {
      recipientOrganization: {
        address: addressUI({
          omit: ['isMilitary', 'street3'],
        }),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      burialInformation: {
        type: 'object',
        properties: {
          recipientOrganization: {
            type: 'object',
            required: ['address'],
            properties: {
              address: addressSchema({
                omit: ['isMilitary', 'street3'],
              }),
            },
          },
        },
      },
    },
  },
};
