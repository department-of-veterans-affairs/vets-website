import {
  emailSchema,
  emailUI,
  phoneSchema,
  phoneUI,
  largeTitleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export const phoneAndEmailPage = {
  uiSchema: {
    ...largeTitleUI('Phone and email address'),
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
