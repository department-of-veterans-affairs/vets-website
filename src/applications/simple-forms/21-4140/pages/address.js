// @ts-check
import {
  addressUI,
  addressSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Address'),
    address: addressUI({
      labels: {
        militaryCheckbox:
          'I live on a U.S. military base outside of the United States.',
        street2: 'Apartment or unit number',
      },
      omit: ['street3'],
    }),
  },
  schema: {
    type: 'object',
    properties: {
      address: addressSchema({ omit: ['street3'] }),
    },
    required: ['address'],
  },
};
