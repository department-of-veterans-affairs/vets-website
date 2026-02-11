import {
  addressSchema,
  addressUI,
  arrayBuilderItemFirstPageTitleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const customAddressSchema = {
  ...addressSchema({
    keys: { street: 'street1' },
    omit: ['isMilitary'],
  }),
  properties: {
    ...addressSchema({
      keys: { street: 'street1' },
      omit: ['isMilitary'],
    }).properties,
    country: {
      ...addressSchema({
        keys: { street: 'street1' },
        omit: ['isMilitary'],
      }).properties.country,
      default: 'USA',
    },
  },
};

export default {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Property with VA home loan: Address of the property',
      nounSingular: 'property address',
      description:
        'Provide the address of the property that was purchased with a VA home loan.',
    }),
    propertyAddress: {
      ...addressUI({
        keys: { street: 'street1' },
        omit: ['isMilitary'],
      }),
      country: {
        ...addressUI({
          keys: { street: 'street1' },
          omit: ['isMilitary'],
        }).country,
        'ui:options': {
          inert: true,
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      propertyAddress: customAddressSchema,
    },
    required: ['propertyAddress'],
  },
};
