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
    permanentAddress: addressUI({
      omit: ['street3'],
    }),
  },
  schema: {
    type: 'object',
    properties: {
      permanentAddress: addressSchema({
        omit: ['street3'],
      }),
    },
  },
};
