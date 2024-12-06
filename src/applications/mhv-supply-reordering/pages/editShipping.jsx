import React from 'react';
import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import UnsavedFieldNote from '../components/UnsavedFieldNote';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Shipping address'),
    'ui:description': <UnsavedFieldNote fieldName="shipping address" />,
    shippingAddress: addressUI({
      omit: ['street3'],
    }),
  },
  schema: {
    type: 'object',
    properties: {
      shippingAddress: addressSchema({
        omit: ['street3'],
      }),
    },
  },
};
