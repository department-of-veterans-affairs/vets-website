import React from 'react';
import {
  titleUI,
  textUI,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  internationalPhoneSchema,
  internationalPhoneUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { validateWhiteSpace } from 'platform/forms/validations';

const uiSchema = {
  authorizedOfficial: {
    ...titleUI('Your information'),
    'ui:description': (
      <p className="vads-u-margin-top--2">
        <strong>Note:</strong> The person filling out and signing this form must
        be a person authorized to enter the school or training establishment
        into a binding agreement with the Department of Veterans Affairs as an
        authorizing official.
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
    phoneNumber: internationalPhoneUI('Your phone number'),
  },
};

const schema = {
  type: 'object',
  properties: {
    authorizedOfficial: {
      type: 'object',
      properties: {
        fullName: fullNameNoSuffixSchema,
        title: {
          type: 'string',
          minLength: 1,
          maxLength: 60,
        },
        phoneNumber: internationalPhoneSchema(),
      },
      required: ['fullName', 'title', 'phoneNumber'],
    },
  },
};

export { uiSchema, schema };
