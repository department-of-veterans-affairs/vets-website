import {
  emailUI,
  phoneUI,
  phoneSchema,
  emailSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Your organization’s contact information',
      'We’ll contact your organization at the email address and phone number you provide here.',
    ),
    yourContactInfoEmail: emailUI(),
    yourContactInfoPhone: phoneUI(),
  },
  schema: {
    type: 'object',
    properties: {
      yourContactInfoEmail: emailSchema,
      yourContactInfoPhone: phoneSchema,
    },
    // required: ['yourContactInfoEmail, yourContactInforPhone'],
  },
};
