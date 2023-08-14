import React from 'react';

import definitions from 'vets-json-schema/dist/definitions.json';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import formDefinitions from '../definitions/form-definitions';

/** @type {PageSchema} */
export default {
  uiSchema: {
    witnessPhone: {
      'ui:title': 'Phone number',
      'ui:autocomplete': 'tel-national',
    },
    witnessEmail: emailUI(
      <span>
        Email address
        <br />
        When you enter your email address, you agree to receive emails from us
        about your claim.
      </span>,
    ),
  },
  schema: {
    type: 'object',
    required: ['witnessPhone'],
    properties: {
      witnessPhone: definitions.phone,
      witnessEmail: formDefinitions.pdfEmail,
    },
  },
};
