import {
  addressNoMilitarySchema,
  addressNoMilitaryUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    claimantMailingAddress: addressNoMilitaryUI({
      omit: ['isMilitary', 'street3'],
      required: true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      claimantMailingAddress: addressNoMilitarySchema({
        omit: ['isMilitary', 'street3'],
      }),
    },
    required: ['claimantMailingAddress'],
  },
};
