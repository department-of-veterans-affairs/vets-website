import React from 'react';
import {
  textUI,
  textSchema,
  phoneUI,
  emailUI,
  emailSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import AutoSaveNotice from '../../../components/AutoSaveNotice';

export default {
  uiSchema: {
    'ui:description': (
      <>
        <AutoSaveNotice />
        <h3 className="vads-u-margin-top--0">
          Funeral home contact information
        </h3>
      </>
    ),

    funeralContactFirstName: {
      ...textUI({
        title: 'First name',
        errorMessages: { required: 'Enter the first name' },
      }),
      'ui:required': () => true,
    },

    funeralContactLastName: {
      ...textUI({
        title: 'Last name',
        errorMessages: { required: 'Enter the last name' },
      }),
      'ui:required': () => true,
    },

    funeralContactPhoneNumber: phoneUI({
      title: 'Phone number',
      errorMessages: {
        required: 'Enter a 10-digit phone number (you can include +1 or 1)',
        pattern: 'Enter a valid U.S. phone number',
      },
      required: () => true,
    }),

    funeralContactEmailAddress: emailUI({
      title: 'Email address',
      errorMessages: { required: 'Enter an email address' },
      required: () => true,
    }),

    'ui:order': [
      'funeralContactFirstName',
      'funeralContactLastName',
      'funeralContactPhoneNumber',
      'funeralContactEmailAddress',
    ],
  },

  schema: {
    type: 'object',
    properties: {
      funeralContactFirstName: textSchema,
      funeralContactLastName: textSchema,
      funeralContactPhoneNumber: {
        type: 'string',
        pattern: '^(?:\\+?1)?\\d{10}$',
        title: 'Phone number',
      },
      funeralContactEmailAddress: emailSchema,
    },
    required: [
      'funeralContactFirstName',
      'funeralContactLastName',
      'funeralContactPhoneNumber',
      'funeralContactEmailAddress',
    ],
  },
};
