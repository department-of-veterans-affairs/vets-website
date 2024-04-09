import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { WCv3Address } from '../components/viewElements';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Web component Address'),
    addresses: {
      'ui:options': {
        itemName: 'Address',
        viewField: WCv3Address,
        customTitle: ' ',
        useDlWrap: true,
        keepInPageOnReview: true,
      },
      items: {
        wcv3Address: addressUI(),
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
          required: ['wcv3Address'],
          properties: {
            wcv3Address: addressSchema(),
          },
        },
      },
    },
  },
};
