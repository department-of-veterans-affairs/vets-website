import React from 'react';
import { omit } from 'lodash';

import fullSchema from '../config/schema';

import {
  schema as addressSchema,
  uiSchema as addressUI,
} from '../../../../platform/forms/definitions/address';

export function incidentLocationSchemas() {
  const addressOmitions = [
    'addressLine1',
    'addressLine2',
    'addressLine3',
    'postalCode',
    'zipCode',
  ];

  const addressSchemaConfig = addressSchema(fullSchema);
  const addressUIConfig = omit(addressUI(' '), addressOmitions);

  return {
    addressUI: {
      ...addressUIConfig,
      state: {
        ...addressUIConfig.state,
        'ui:title': 'State/Province',
      },
      additionalDetails: {
        'ui:title':
          'Additional details (Include address, landmark, military installation, or other location.)',
        'ui:widget': 'textarea',
      },
      'ui:order': ['country', 'state', 'city', 'additionalDetails'],
    },
    addressSchema: {
      ...addressSchemaConfig,
      properties: {
        ...omit(addressSchemaConfig.properties, addressOmitions),
        additionalDetails: {
          type: 'string',
        },
      },
    },
  };
}

export const ptsdLocationDescription = () => (
  <div>
    <h5>Event location</h5>
    <p>Where did the event happen? Please be as specific as you can.</p>
  </div>
);
