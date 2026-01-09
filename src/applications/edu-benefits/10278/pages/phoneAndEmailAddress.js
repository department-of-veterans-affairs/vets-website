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
    ...titleUI('Phone and email address'),
    phoneNumber: internationalPhoneUI({
      title: 'Phone number',
      hint: null,
      errorMessages: {
        required: 'Please enter your phone number',
      },
    }),
    emailAddress: emailUI(),
  },
  schema: {
    type: 'object',
    properties: {
      phoneNumber: internationalPhoneSchema(),
      emailAddress: emailSchema,
    },
    required: ['phoneNumber'],
  },
};
