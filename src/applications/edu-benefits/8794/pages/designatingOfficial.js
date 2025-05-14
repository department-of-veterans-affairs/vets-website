import React from 'react';
import {
  titleUI,
  radioSchema,
  radioUI,
  textSchema,
  textUI,
  phoneUI,
  phoneSchema,
  internationalPhoneUI,
  internationalPhoneSchema,
  emailUI,
  emailSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const phoneLabels = {
  us: 'US phone number',
  intl: 'International phone number',
};

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
    first: {
      ...textUI({
        title: 'First name',
        errorMessages: {
          required: 'Enter your first name',
        },
        validations: [
          (errors, fieldData) => {
            if (fieldData.length > 50) {
              errors.addError('Enter your first name with up to 50 characters');
            }
          },
        ],
      }),
    },
    middle: {
      ...textUI({
        title: 'Middle name',
        validations: [
          (errors, fieldData) => {
            if (fieldData.length > 50) {
              errors.addError(
                'Enter your middle name with up to 50 characters',
              );
            }
          },
        ],
      }),
    },
    last: {
      ...textUI({
        title: 'Last name',
        errorMessages: {
          required: 'Enter your last name',
        },
        validations: [
          (errors, fieldData) => {
            if (fieldData.length > 50) {
              errors.addError('Enter your last name with up to 50 characters');
            }
          },
        ],
      }),
    },
    title: {
      ...textUI({
        title: 'Your title',
        errorMessages: {
          required: 'Enter your title',
        },
        validations: [
          (errors, fieldData) => {
            if (fieldData.length > 50) {
              errors.addError('Enter your title with up to 50 characters');
            }
          },
        ],
      }),
    },
    phoneType: radioUI({
      title: 'Select a type of phone number to enter for this individual',
      labels: phoneLabels,
      errorMessages: {
        required: 'Select a type of phone number',
      },
    }),
    phoneNumber: {
      ...phoneUI({
        title: 'Phone number',
        hint: 'For US phone numbers. Enter a 10-digit phone number.',
      }),
      'ui:errorMessages': {
        pattern: 'Enter a 10-digit phone number (with or without dashes)',
        required: 'Enter a 10-digit phone number (with or without dashes)',
      },
    },
    internationalPhoneNumber: {
      ...internationalPhoneUI({
        title: 'International phone number',
        hint:
          'For non-US phone numbers. Enter a phone number with up to 15 digits.',
      }),
      'ui:errorMessages': {
        pattern: 'Enter a phone number with up to 15 digits',
        required: 'Enter a phone number with up to 15 digits',
      },
    },
    emailAddress: emailUI({
      title: 'Email address',
      errorMessages: {
        required:
          'Enter a valid email address without spaces using this format: email@domain.com',
      },
    }),
    'ui:options': {
      updateSchema: (formData, formSchema) => {
        if (formData.designatingOfficial.phoneType === 'us') {
          return {
            ...formSchema,
            required: [
              'first',
              'last',
              'title',
              'phoneType',
              'phoneNumber',
              'emailAddress',
            ],
          };
        }
        if (formData.designatingOfficial.phoneType === 'intl') {
          return {
            ...formSchema,
            required: [
              'first',
              'last',
              'title',
              'phoneType',
              'internationalPhoneNumber',
              'emailAddress',
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
    designatingOfficial: {
      type: 'object',
      properties: {
        first: textSchema,
        middle: textSchema,
        last: textSchema,
        title: textSchema,
        phoneType: radioSchema(Object.keys(phoneLabels)),
        phoneNumber: phoneSchema,
        internationalPhoneNumber: internationalPhoneSchema,
        emailAddress: emailSchema,
      },
      required: ['first', 'last', 'title', 'phoneType', 'emailAddress'],
    },
  },
};

export { uiSchema, schema };
