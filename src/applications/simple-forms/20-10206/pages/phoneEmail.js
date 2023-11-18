import {
  emailSchema,
  emailUI,
  phoneSchema,
  phoneUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Your phone and email address'),
    homePhone: phoneUI('Home phone number'),
    internationalPhone: phoneUI('Mobile phone number'),
    emailAddress: emailUI(),
  },
  schema: {
    type: 'object',
    properties: {
      homePhone: phoneSchema,
      internationalPhone: phoneSchema,
      emailAddress: emailSchema,
    },
    required: ['homePhone'],
  },
};
