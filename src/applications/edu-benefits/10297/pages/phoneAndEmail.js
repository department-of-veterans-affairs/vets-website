import React from 'react';
import {
  emailSchema,
  emailUI,
  internationalPhoneSchema,
  internationalPhoneUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI({
    title: 'Phone and email address',
    description: (
      <>
        <p>
          <b>We’ll use this information to:</b>
        </p>
        <ul>
          <li>Contact you if we have questions about your application</li>
          <li>Tell you important information about your benefits</li>
        </ul>
        <p>
          This is the contact information we have on file for you. If you notice
          any errors, please correct them now. Any updates you make will change
          the information for your education benefits only.
        </p>
        <p>
          <b>Note:</b> If you want to update your contact information for other
          VA benefits, you can do that from your profile.
        </p>
        <p className="vads-u-margin-bottom--0">
          <va-link href="/profile" text="Go to your profile" />
        </p>
      </>
    ),
    classNames: 'vads-u-color--base vads-u-margin-top--0',
  }),
  contactInfo: {
    mobilePhone: internationalPhoneUI('Mobile phone number'),
    homePhone: internationalPhoneUI('Home phone number'),
    emailAddress: emailUI({
      title: 'Email',
      errorMessages: {
        required: 'Please enter an email address',
        pattern:
          'Enter a valid email address using thes format email@domain.com. Your email address can only have letters, numbers, the @ symbbol and a period, with no spaces.',
        format:
          'Enter a valid email address using thes format email@domain.com. Your email address can only have letters, numbers, the @ symbbol and a period, with no spaces.',
      },
    }),
  },
};

const schema = {
  type: 'object',
  properties: {
    contactInfo: {
      type: 'object',
      required: ['emailAddress'],
      properties: {
        mobilePhone: internationalPhoneSchema(),
        homePhone: internationalPhoneSchema(),
        emailAddress: { ...emailSchema, pattern: '^[a-zA-Z0-9@.]+$' },
      },
    },
  },
};

export { schema, uiSchema };
