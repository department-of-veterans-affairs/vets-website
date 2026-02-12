import {
  addressSchema,
  addressUI,
  arrayBuilderItemFirstPageTitleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { VaSelectField } from 'platform/forms-system/src/js/web-component-fields';

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
        'ui:title': 'Country',
        'ui:autocomplete': 'country',
        'ui:webComponentField': VaSelectField,
        'ui:required': () => true,
        'ui:options': {
          // inert: true, // can't use inert because it prevents selection needed to toggle state input
          updateSchema: () => ({
            type: 'string',
            enum: ['USA'],
            enumNames: ['United States'],
            // default: 'USA', // using default doesn't update state input to select component
          }),
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      propertyAddress: addressSchema({
        keys: { street: 'street1' },
        omit: ['isMilitary'],
      }),
    },
    required: ['propertyAddress'],
  },
};
