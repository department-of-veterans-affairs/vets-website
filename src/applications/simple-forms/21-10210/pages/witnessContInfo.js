import React from 'react';

import definitions from 'vets-json-schema/dist/definitions.json';
import emailUI from 'platform/forms-system/src/js/definitions/email';

export default {
  uiSchema: {
    witnessPhone: {
      'ui:title': 'Phone number',
    },
    witnessEmail: emailUI(
      <span>
        Email address
        <br />
        By providing an email address, I agree to receive electronic
        correspondence from VA regarding my application
      </span>,
    ),
  },
  schema: {
    type: 'object',
    required: ['witnessPhone'],
    properties: {
      witnessPhone: definitions.phone,
      witnessEmail: definitions.email,
    },
  },
};
