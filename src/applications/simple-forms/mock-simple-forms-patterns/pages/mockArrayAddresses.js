import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { ArrayAddress } from '../components/viewElements';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Web component Address'),
    addresses: {
      'ui:options': {
        itemName: 'Address',
        viewField: ArrayAddress,
        customTitle: ' ',
        useDlWrap: true,
        keepInPageOnReview: true,
      },
      items: {
        arrayAddress: addressUI(),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      addresses: {
        type: 'array',
        items: {
          type: 'object',
          required: ['arrayAddress'],
          properties: {
            arrayAddress: addressSchema(),
          },
        },
      },
    },
  },
};
