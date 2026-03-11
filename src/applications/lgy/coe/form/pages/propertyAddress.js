import {
  arrayBuilderItemFirstPageTitleUI,
  addressNoMilitaryUI,
  addressNoMilitarySchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const remappedSchema = addressNoMilitarySchema({
  keys: { street: 'street1' },
});

const customAddressSchema = {
  ...remappedSchema,
  properties: {
    ...remappedSchema.properties,
    country: {
      ...remappedSchema.properties.country,
      default: 'USA',
    },
  },
};

const remappedUI = addressNoMilitaryUI({
  keys: { street: 'street1' },
});

export default {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Property with VA home loan: Address of the property',
      nounSingular: 'property address',
      description:
        'Provide the address of the property that was purchased with a VA home loan.',
    }),
    propertyAddress: {
      ...remappedUI,
      country: {
        ...remappedUI.country,
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
