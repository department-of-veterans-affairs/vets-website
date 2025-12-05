import React from 'react';
import {
  titleUI,
  // radioSchema,
  // radioUI,
  textUI,
  internationalPhoneSchema,
  internationalPhoneUI,
  // phoneUI,
  // phoneSchema,
  // internationalPhoneDeprecatedUI,
  // internationalPhoneDeprecatedSchema,
  emailUI,
  emailSchema,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { validateWhiteSpace } from 'platform/forms/validations';

// const phoneLabels = {
//   us: 'US phone number',
//   intl: 'International phone number',
// };

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
    // phoneType: radioUI({
    //   title: 'Select a type of phone number to enter for this individual',
    //   labels: phoneLabels,
    //   errorMessages: {
    //     required: 'Select a type of phone number',
    //   },
    // }),
    // phoneNumber: {
    //   ...phoneUI({
    //     title: 'Phone number',
    //     hint: 'For US phone numbers. Enter a 10-digit phone number.',
    //   }),
    //   'ui:errorMessages': {
    //     pattern: 'Enter a 10-digit phone number (with or without dashes)',
    //     required: 'Enter a 10-digit phone number (with or without dashes)',
    //   },
    // },
    // internationalPhoneNumber: {
    //   ...internationalPhoneDeprecatedUI({
    //     title: 'International phone number',
    //     hint:
    //       'For non-US phone numbers. Enter a phone number with up to 15 digits.',
    //   }),
    //   'ui:errorMessages': {
    //     pattern: 'Enter a phone number with up to 15 digits',
    //     required: 'Enter a phone number with up to 15 digits',
    //   },
    // },
    emailAddress: emailUI({
      title: 'Email address',
      errorMessages: {
        required:
          'Enter a valid email address without spaces using this format: email@domain.com',
      },
    }),
    phoneNumber: internationalPhoneUI('Your phone number'),
    // 'ui:options': {
    //   updateSchema: (formData, formSchema) => {
    //     if (formData.designatingOfficial?.phoneType === 'us') {
    //       return {
    //         ...formSchema,
    //         required: ['title', 'phoneType', 'phoneNumber', 'emailAddress'],
    //       };
    //     }
    //     if (formData.designatingOfficial?.phoneType === 'intl') {
    //       return {
    //         ...formSchema,
    //         required: [
    //           'title',
    //           'phoneType',
    //           'internationalPhoneNumber',
    //           'emailAddress',
    //         ],
    //       };
    //     }

    //     return { ...formSchema };
    //   },
    // },
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
        // phoneType: radioSchema(Object.keys(phoneLabels)),
        // phoneNumber: phoneSchema,
        // internationalPhoneNumber: internationalPhoneDeprecatedSchema,
        emailAddress: emailSchema,
      },
      required: ['title', 'phoneNumber', 'emailAddress'],
    },
  },
};

export { uiSchema, schema };
