import {
  addressNoMilitarySchema,
  addressNoMilitaryUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    veteranMailingAddress: addressNoMilitaryUI({
      omit: ['isMilitary', 'street3'],
      required: true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      veteranMailingAddress: addressNoMilitarySchema({
        omit: ['isMilitary', 'street3'],
      }),
    },
    required: ['veteranMailingAddress'],
  },
};
