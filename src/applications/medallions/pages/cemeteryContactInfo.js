import React from 'react';
import {
  emailUI,
  titleUI,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Cemetery contact information'),
    'ui:description': (
      <p>
        Tell us who to contact at the Veteran&apos;s cemetery. We&apos;ll email
        them and ask them to review and sign your application.
      </p>
    ),
    cemeteryContactFirstName: textUI({
      title: 'First name',
      required: () => true,
      errorMessages: {
        required: 'Please enter a first name',
      },
    }),
    cemeteryContactLastName: textUI({
      title: 'Last name',
      required: () => true,
      errorMessages: {
        required: 'Please enter a last name',
      },
    }),
    cemeteryContactEmail: {
      ...emailUI(),
      'ui:title': 'Email address',
      'ui:description': (
        <p className="vads-u-color--gray-medium vads-u-margin-top--0">
          If the email address is wrong, we can&apos;t process your form
        </p>
      ),
      'ui:required': () => true,
      'ui:errorMessages': {
        required: 'Please enter an email address',
        pattern:
          'Enter a valid email address using the format email@domain.com.',
      },
    },
  },
  schema: {
    type: 'object',
    required: [
      'cemeteryContactFirstName',
      'cemeteryContactLastName',
      'cemeteryContactEmail',
    ],
    properties: {
      cemeteryContactFirstName: {
        ...textSchema,
        maxLength: 15,
      },
      cemeteryContactLastName: {
        ...textSchema,
        maxLength: 25,
      },
      cemeteryContactEmail: {
        type: 'string',
        format: 'email',
        maxLength: 50,
      },
    },
  },
};
