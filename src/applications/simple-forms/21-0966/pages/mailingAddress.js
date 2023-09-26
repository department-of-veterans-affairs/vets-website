import React from 'react';
import {
  addressSchema,
  addressUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    legend: {
      'ui:description': (
        <div>
          <h3>Mailing address</h3>
          <p>
            We'll send any important information about your application to this
            address.
          </p>
        </div>
      ),
    },
    veteranMailingAddress: addressUI(),
  },
  schema: {
    type: 'object',
    required: ['veteranMailingAddress'],
    properties: {
      legend: {
        type: 'object',
        properties: {},
      },
      veteranMailingAddress: addressSchema(),
    },
  },
};
