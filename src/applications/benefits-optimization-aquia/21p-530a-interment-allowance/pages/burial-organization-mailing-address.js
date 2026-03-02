import {
  addressUI,
  addressSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export const burialOrganizationMailingAddressPage = {
  uiSchema: {
    ...titleUI('Interment organization’s mailing address'),
    'ui:description':
      'We’ll send any important information about your application to this address.',
    burialInformation: {
      recipientOrganization: {
        address: addressUI({
          omit: ['isMilitary', 'street3'],
          labels: {
            street2: 'Apt./Unit Number',
          },
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
              address: {
                ...addressSchema({
                  omit: ['isMilitary', 'street3'],
                }),
                properties: {
                  ...addressSchema({
                    omit: ['isMilitary', 'street3'],
                  }).properties,
                  street2: {
                    ...addressSchema({
                      omit: ['isMilitary', 'street3'],
                    }).properties.street2,
                    maxLength: 5,
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
