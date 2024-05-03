import {
  emailSchema,
  emailUI,
  phoneSchema,
  phoneUI,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export const phoneAndEmailPage = {
  uiSchema: {
    ...titleUI('Phone and email address', undefined, 1, 'vads-u-color--black'),
    phone: phoneUI('Home phone number', { required: true }),
    emailAddress: emailUI('Email'),
  },
  schema: {
    type: 'object',
    properties: {
      phone: phoneSchema,
      emailAddress: emailSchema,
    },
    required: ['phone'],
  },
};
