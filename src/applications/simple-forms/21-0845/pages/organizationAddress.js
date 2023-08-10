import React from 'react';

import definitions from 'vets-json-schema/dist/definitions.json';
import { uiSchema, schema } from '../../shared/definitions/pdfAddress';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': <h3 className="custom-header">Organization’s address</h3>,
    organizationAddress: uiSchema({
      root: '',
      country: 'Organization’s country',
      street: 'Organization’s street address',
      street2: 'Apartment or unit number',
    }),
  },
  schema: {
    type: 'object',
    required: ['organizationAddress'],
    properties: {
      organizationAddress: schema({ definitions }, true, 'address', {
        street: 30,
        street2: 5,
        city: 18,
      }),
    },
  },
};
