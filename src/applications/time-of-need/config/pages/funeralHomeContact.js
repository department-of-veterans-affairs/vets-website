import React from 'react';
import {
  textUI,
  textSchema,
  phoneUI,
  phoneSchema,
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
      errorMessages: { required: 'Enter a 10-digit phone number' },
      required: () => true,
    }),
  },

  schema: {
    type: 'object',
    properties: {
      firstName: textSchema,
      lastName: textSchema,
      emailAddress: emailSchema,
      phoneNumber: phoneSchema,
    },
    required: ['firstName', 'lastName', 'emailAddress', 'phoneNumber'],
  },
};
