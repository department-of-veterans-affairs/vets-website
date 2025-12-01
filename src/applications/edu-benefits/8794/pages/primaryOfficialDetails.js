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

import { certifyingOfficialInfoAlert } from '../helpers';

// const phoneLabels = {
//   us: 'US phone number',
//   intl: 'International phone number',
// };

const uiSchema = {
  primaryOfficialDetails: {
    ...titleUI('Tell us about your primary certifying official'),
    'ui:description': (
      <>
        <p className="vads-u-margin-top--2">
          The primary certifying official serves as the main point of contact at
          the education or training facility and handles approvals and
          compliance survey inquiries. They are also designated to sign VA
          Enrollment Certifications, Certifications of Change in Student Status,
          Certifications of Delivery of Advance Payments, Certifications of
          Pursuit, Attendance, Flight Training, On-the-Job or Apprenticeship
          Training (as applicable), School Portion of VA Form 22-1990t and other
          Certifications of Enrollment.
        </p>
        {certifyingOfficialInfoAlert}
      </>
    ),
    fullName: fullNameNoSuffixUI(
      title =>
        `${title.charAt(0).toUpperCase() +
          title.slice(1)} of primary certifying official`,
    ),
    title: {
      ...textUI({
        title: 'Title of primary certifying official',
        errorMessages: {
          required: 'Enter a title',
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
    //     title: 'Phone number of primary certifying official',
    //     hint: 'For US phone numbers. Enter a 10-digit phone number.',
    //   }),
    //   'ui:errorMessages': {
    //     pattern: 'Enter a 10-digit phone number (with or without dashes)',
    //     required: 'Enter a 10-digit phone number (with or without dashes)',
    //   },
    // },
    // internationalPhoneNumber: {
    //   ...internationalPhoneDeprecatedUI({
    //     title: 'International phone number of primary certifying official',
    //     hint:
    //       'For non-US phone numbers. Enter a phone number with up to 15 digits.',
    //   }),
    //   'ui:errorMessages': {
    //     pattern: 'Enter a phone number with up to 15 digits',
    //     required: 'Enter a phone number with up to 15 digits',
    //   },
    // },
    emailAddress: emailUI({
      title: 'Email address of primary certifying official',
      errorMessages: {
        required:
          'Enter a valid email address without spaces using this format: email@domain.com',
      },
    }),
    phoneNumber: internationalPhoneUI('Your phone number'),
    // 'ui:options': {
    //   updateSchema: (formData, formSchema) => {
    //     if (formData.primaryOfficialDetails?.phoneType === 'us') {
    //       return {
    //         ...formSchema,
    //         required: ['title', 'phoneType', 'phoneNumber', 'emailAddress'],
    //       };
    //     }
    //     if (formData.primaryOfficialDetails?.phoneType === 'intl') {
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
    primaryOfficialDetails: {
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
