import React from 'react';
import {
  titleUI,
  radioSchema,
  radioUI,
  textUI,
  phoneUI,
  phoneSchema,
  internationalPhoneDeprecatedUI,
  internationalPhoneDeprecatedSchema,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { validateWhiteSpace } from 'platform/forms/validations';

const phoneLabels = {
  us: 'US phone number',
  intl: 'International phone number',
};

const uiSchema = {
  authorizingOfficial: {
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
    phoneType: radioUI({
      title: 'Select a type of phone number to enter for yourself',
      labels: phoneLabels,
      errorMessages: {
        required: 'Select a type of phone number',
      },
    }),
    phoneNumber: {
      ...phoneUI({
        title: 'US Phone number',
        hint: 'Enter a 10-digit phone number.',
      }),
      'ui:errorMessages': {
        pattern: 'Enter a 10-digit phone number (with or without dashes)',
        required: 'Enter a 10-digit phone number (with or without dashes)',
      },
    },
    internationalPhoneNumber: {
      ...internationalPhoneDeprecatedUI({
        title: 'International phone number',
        hint:
          'For non-US phone numbers. Enter a phone number with up to 15 digits.',
      }),
      'ui:errorMessages': {
        pattern: 'Enter a phone number with up to 15 digits',
        required: 'Enter a phone number with up to 15 digits',
      },
    },

    'ui:options': {
      updateSchema: (formData, formSchema) => {
        if (formData.authorizingOfficial?.phoneType === 'us') {
          return {
            ...formSchema,
            required: ['fullName', 'title', 'phoneType', 'phoneNumber'],
          };
        }
        if (formData.authorizingOfficial?.phoneType === 'intl') {
          return {
            ...formSchema,
            required: [
              'fullName',
              'title',
              'phoneType',
              'internationalPhoneNumber',
            ],
          };
        }

        return { ...formSchema };
      },
    },
  },
};

const schema = {
  type: 'object',
  properties: {
    authorizingOfficial: {
      type: 'object',
      properties: {
        fullName: fullNameNoSuffixSchema,
        title: {
          type: 'string',
          minLength: 1,
          maxLength: 60,
        },
        phoneType: radioSchema(Object.keys(phoneLabels)),
        phoneNumber: phoneSchema,
        internationalPhoneNumber: internationalPhoneDeprecatedSchema,
      },
      required: ['fullName', 'title', 'phoneType'],
    },
  },
};

export { uiSchema, schema };
