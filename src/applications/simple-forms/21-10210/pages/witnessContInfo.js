import React from 'react';

import emailUI from 'platform/forms-system/src/js/definitions/email';
import formDefinitions from '../definitions/form-definitions';

/** @type {PageSchema} */
export default {
  uiSchema: {
    witnessPhone: {
      'ui:title': 'Phone number',
      'ui:autocomplete': 'tel',
      'ui:errorMessages': {
        minLength:
          'Please enter a 10-digit phone number (with or without dashes)',
        pattern:
          'Please enter a 10-digit phone number (with or without dashes)',
        required:
          'Please enter a 10-digit phone number (with or without dashes)',
      },
      'ui:options': {
        inputType: 'tel',
      },
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
    required: ['witnessPhone', 'witnessEmail'],
    properties: {
      witnessPhone: formDefinitions.phone,
      witnessEmail: formDefinitions.pdfEmail,
    },
  },
};
