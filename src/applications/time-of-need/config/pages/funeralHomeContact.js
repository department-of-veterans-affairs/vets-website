import React from 'react';
import {
  textUI,
  textSchema,
  phoneUI,
  emailUI,
  emailSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import AutoSaveNotice from '../../components/AutoSaveNotice';

export default {
  uiSchema: {
    'ui:description': (
      <>
        <AutoSaveNotice />
        <h3 className="vads-u-margin-top--0">Funeral home point of contact</h3>
      </>
    ),

    firstName: {
      ...textUI({
        title: 'First name',
        errorMessages: { required: 'Enter the first name' },
      }),
      'ui:required': () => true,
    },

    lastName: {
      ...textUI({
        title: 'Last name',
        errorMessages: { required: 'Enter the last name' },
      }),
      'ui:required': () => true,
    },

    emailAddress: emailUI({
      title: 'Email address',
      errorMessages: { required: 'Enter an email address' },
      required: () => true,
    }),

    phoneNumber: phoneUI({
      title: 'Phone number',
      errorMessages: {
        required: 'Enter a 10-digit phone number (you can include +1 or 1)',
        pattern: 'Enter a valid U.S. phone number',
      },
      required: () => true,
    }),
  },

  schema: {
    type: 'object',
    properties: {
      firstName: textSchema,
      lastName: textSchema,
      emailAddress: emailSchema,
      phoneNumber: {
        type: 'string',
        pattern: '^(?:\\+?1)?\\d{10}$',
        title: 'Phone number',
      },
    },
    required: ['firstName', 'lastName', 'emailAddress', 'phoneNumber'],
  },
};
