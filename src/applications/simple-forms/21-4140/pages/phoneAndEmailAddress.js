// @ts-check
import {
  titleUI,
  phoneUI,
  phoneSchema,
  emailUI,
  emailSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const phoneNumberUISchema = phoneUI('Home phone number');
phoneNumberUISchema['ui:errorMessages'] = {
  required: 'Please enter your 10-digit phone number (with or without dashes)',
};

const emailAddressUISchema = emailUI('Email address');

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Your phone and email address'),
    phoneNumber: phoneNumberUISchema,
    mobilePhoneNumber: phoneUI('Mobile phone number'),
    emailAddress: emailAddressUISchema,
  },
  schema: {
    type: 'object',
    properties: {
      phoneNumber: phoneSchema,
      mobilePhoneNumber: phoneSchema,
      emailAddress: emailSchema,
    },
    required: ['phoneNumber'],
  },
};
