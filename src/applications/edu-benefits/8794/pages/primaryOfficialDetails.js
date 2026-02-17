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
import { certifyingOfficialInfoAlert } from '../helpers';

const uiSchema = {
  primaryOfficialDetails: {
    ...titleUI('Tell us about your primary certifying official'),
    'ui:description': (
      <>
        <p className="vads-u-margin-top--2">
          The primary certifying official serves as the main point of contact at
          the education or training facility and handles approval and compliance
          survey inquiries. They are also designated to sign VA Enrollment
          Certifications, Certifications of Change in Student Status,
          Certifications of Pursuit, Attendance, Flight Training, On-the-Job or
          Apprenticeship Training (as applicable), School Portion of VA Form
          22-1990t and other Certifications of Enrollment.
        </p>
        {certifyingOfficialInfoAlert}
      </>
    ),
    fullName: fullNameNoSuffixUI(
      title =>
        `${
          title.charAt(0).toUpperCase() + title.slice(1)
        } of primary certifying official`,
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
    emailAddress: emailUI({
      title: 'Email address of primary certifying official',
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
        emailAddress: emailSchema,
      },
      required: ['title', 'phoneNumber', 'emailAddress'],
    },
  },
};

export { uiSchema, schema };
