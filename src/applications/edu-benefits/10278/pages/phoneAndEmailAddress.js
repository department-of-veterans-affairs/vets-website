import {
  emailSchema,
  emailUI,
  internationalPhoneSchema,
  internationalPhoneUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Your phone and email address'),
    claimantContactInformation: {
      phoneNumber: internationalPhoneUI({
        title: 'Phone number',
        hint: null,
        errorMessages: {
          required: 'Please enter your phone number',
        },
      }),
      emailAddress: emailUI({
        title: 'Email',
        hint: "We'll use this email address to send you notifications in regards to your claim",
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      claimantContactInformation: {
        type: 'object',
        properties: {
          phoneNumber: internationalPhoneSchema(),
          emailAddress: emailSchema,
        },
        required: ['phoneNumber'],
      },
    },
  },
};
