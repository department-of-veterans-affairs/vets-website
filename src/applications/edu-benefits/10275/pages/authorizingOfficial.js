import React from 'react';
import {
  titleUI,
  radioSchema,
  radioUI,
  textUI,
  phoneUI,
  phoneSchema,
  internationalPhoneDeprecatedUI,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { validateWhiteSpace } from 'platform/forms/validations';

const phoneLabels = {
  us: 'US phone number',
  intl: 'International phone number',
};

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
    phoneType: radioUI({
      title: 'Select a type of phone number to enter for yourself',
      labels: phoneLabels,
      errorMessages: {
        required: 'Select a type of phone number',
      },
    }),
    'view:phoneType': radioUI({
      title: 'Select a type of phone number to enter for yourself',
      labels: phoneLabels,
      required: () => true,
      errorMessages: {
        required: 'Select a type of phone number',
      },
    }),
    usPhone: {
      ...phoneUI({
        title: 'US Phone number',
        hint: 'Enter a 10-digit phone number.',
      }),
      'ui:errorMessages': {
        pattern: 'Enter a 10-digit phone number (with or without dashes)',
        required: 'Enter a 10-digit phone number (with or without dashes)',
      },
    },
    internationalPhone: {
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
        if (formData.authorizedOfficial['view:phoneType'] === 'us') {
          return {
            ...formSchema,
            required: ['fullName', 'title', 'view:phoneType', 'usPhone'],
          };
        }
        if (formData.authorizedOfficial['view:phoneType'] === 'intl') {
          return {
            ...formSchema,
            required: [
              'fullName',
              'title',
              'view:phoneType',
              'internationalPhone',
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
    authorizedOfficial: {
      type: 'object',
      properties: {
        fullName: fullNameNoSuffixSchema,
        title: {
          type: 'string',
          minLength: 1,
          maxLength: 60,
        },
        'view:phoneType': radioSchema(Object.keys(phoneLabels)),
        usPhone: phoneSchema,
        internationalPhone: {
          type: 'string',
          pattern: '^\\+?[0-9](?:-?[0-9]){10,14}$',
        },
      },
      required: ['fullName', 'title', 'view:phoneType'],
    },
  },
};

export { uiSchema, schema };
