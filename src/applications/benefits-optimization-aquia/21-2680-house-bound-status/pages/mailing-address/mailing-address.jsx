/**
 * @module pages/mailing-address
 * @description Page configuration for veteran's mailing address
 */

import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * Mailing address page configuration
 * Collects veteran's mailing address for correspondence
 * @type {PageSchema}
 */
export const mailingAddress = {
  uiSchema: {
    ...titleUI(
      'Mailing address',
      "We'll send any important information about your application to this address.",
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
