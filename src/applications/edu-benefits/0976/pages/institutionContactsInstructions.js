// @ts-check
import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Provide Contacts for Your Institution'),
    'view:contactsInstructions': {
      'ui:description': (
        <div>
          <p>
            You will be asked to provide the contact information for both the
            financial representative and the certifying official of your
            institution.
          </p>

          <p>
            <strong>Note:</strong> The authorizing official information should
            match the information you provided at the beginning of this form.
          </p>
        </div>
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:contactsInstructions': {
        type: 'object',
        properties: {},
      },
    },
  },
};
