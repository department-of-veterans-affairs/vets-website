import {
  addressSchema,
  addressUI,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export const veteranMailingAddressPage = {
  uiSchema: {
    ...titleUI({
      title: "Veteran's mailing address",
      description:
        'We’ll send any important information about your application to this address.',
      headerLevel: 1,
    }),
    veteranMailingAddress: addressUI({
      labels: {
        street2: 'Street address line 2',
        street3: 'Street address line 3',
      },
      required: true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      veteranMailingAddress: addressSchema(),
    },
  },
};

