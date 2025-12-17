import React from 'react';
import {
  titleUI,
  textUI,
  internationalPhoneSchema,
  internationalPhoneUI,
  emailUI,
  emailSchema,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { validateWhiteSpace } from 'platform/forms/validations';

const uiSchema = {
  designatingOfficial: {
    ...titleUI('Your information'),
    'ui:description': (
      <p className="vads-u-margin-top--2">
        <strong>Note:</strong> The person filling out and signing this form must
        be a person authorized to enter the school or training establishment
        into a binding agreement with the Department of Veterans Affairs as a
        "designating official".
      </p>
    ),
    fullName: fullNameNoSuffixUI(false),
    title: {
      ...textUI({
        title: 'Your title',
        errorMessages: {
          required: 'Enter your title',
        },
        validations: [validateWhiteSpace],
      }),
    },
    emailAddress: emailUI({
      title: 'Email address',
      errorMessages: {
        required:
          'Enter a valid email address without spaces using this format: email@domain.com',
      },
    }),
    phoneNumber: internationalPhoneUI('Your phone number'),
  },
};

const schema = {
  type: 'object',
  properties: {
    designatingOfficial: {
      type: 'object',
      properties: {
        fullName: fullNameNoSuffixSchema,
        title: {
          type: 'string',
          minLength: 1,
          maxLength: 60,
        },
        phoneNumber: internationalPhoneSchema(),
        emailAddress: emailSchema,
      },
      required: ['title', 'phoneNumber', 'emailAddress'],
    },
  },
};

export { uiSchema, schema };
