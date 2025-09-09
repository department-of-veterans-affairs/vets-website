import React from 'react';
import {
  addressUI,
  addressSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import AutoSaveNotice from '../../../components/AutoSaveNotice';

export default {
  uiSchema: {
    // Auto-save notice first, then the page heading
    'ui:description': (
      <>
        <AutoSaveNotice />
        <h3 className="vads-u-margin-top--0">Funeral home address</h3>
      </>
    ),

    // Use pattern omit option instead of manually hiding subfields
    funeralHomeAddress: addressUI({
      omit: ['isMilitary', 'street3'],
      labels: {
        country: 'Country',
        street: 'Street address',
        street2: 'Street address line 2 (optional)',
        city: 'City',
        state: 'State or territory',
        postalCode: 'Postal code',
      },
      errorMessages: {
        required: 'Enter the funeral home address',
        country: 'Select a country',
        street: 'Enter a street address',
        city: 'Enter a city',
        state: 'Select a state or territory',
        postalCode: 'Enter a postal code',
      },
    }),
  },

  schema: {
    type: 'object',
    properties: {
      // If addressSchema supports the same omit option, pass it; otherwise it will ignore extras.
      funeralHomeAddress: addressSchema({ omit: ['isMilitary', 'street3'] }),
    },
    required: ['funeralHomeAddress'],
  },
};
