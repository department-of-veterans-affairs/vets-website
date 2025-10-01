// @ts-check
import {
  titleUI,
  phoneUI,
  phoneSchema,
  emailUI,
  emailSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Your phone and email address'),
    phoneNumber: phoneUI('Home phone number'),
    mobilePhoneNumber: phoneUI('Mobile phone number'),
    emailAddress: emailUI('Email address'),
  },
  schema: {
    type: 'object',
    properties: {
      phoneNumber: phoneSchema,
      mobilePhoneNumber: phoneSchema,
      emailAddress: emailSchema,
    },
    required: ['phoneNumber', 'emailAddress'],
  },
};
