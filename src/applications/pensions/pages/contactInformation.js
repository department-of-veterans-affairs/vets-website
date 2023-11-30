import {
  emailSchema,
  emailUI,
  phoneSchema,
  phoneUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { VaTextInputField } from '@department-of-veterans-affairs/platform-forms-system/web-component-fields';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Email address and phone number',
    email: emailUI('Email'),
    phone: phoneUI('Telephone number'),
    mobilePhone: phoneUI('Mobile number'),
    internationalPhone: {
      'ui:title': 'International phone number',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        classNames: 'vads-u-margin-bottom--2',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['email', 'mobilePhone'],
    properties: {
      email: emailSchema,
      phone: phoneSchema,
      mobilePhone: phoneSchema,
      internationalPhone: {
        type: 'string',
      },
    },
  },
};
