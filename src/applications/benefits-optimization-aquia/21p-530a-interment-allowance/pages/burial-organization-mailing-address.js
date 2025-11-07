import {
  addressUI,
  addressSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    burialOrganizationMailingAddress: addressUI({
      omit: ['isMilitary', 'street3'],
    }),
  },
  schema: {
    type: 'object',
    required: ['burialOrganizationMailingAddress'],
    properties: {
      burialOrganizationMailingAddress: addressSchema({
        omit: ['isMilitary', 'street3'],
      }),
    },
  },
};
