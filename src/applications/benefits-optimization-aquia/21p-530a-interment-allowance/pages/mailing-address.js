/**
 * @module pages/mailing-address
 * @description Page configuration for veteran mailing address
 */

import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * Page configuration for mailing address
 * @type {PageSchema}
 */
export const mailingAddress = {
  uiSchema: {
    ...titleUI(
      'Mailing address',
      'We’ll send any important information about your application to this address.',
    ),
    address: addressUI({
      omit: ['street3'],
    }),
  },
  schema: {
    type: 'object',
    properties: {
      address: addressSchema({
        omit: ['street3'],
      }),
    },
  },
};

// Platform expects default export for pages
export default mailingAddress;
