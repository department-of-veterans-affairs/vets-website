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
    ...titleUI('Phone and email address'),
    citizenHomePhone: phoneUI('Home phone number'),
    citizenInternationalPhone: phoneUI('Mobile phone number'),
    citizenEmailAddress: emailUI(),
  },
  schema: {
    type: 'object',
    properties: {
      citizenHomePhone: phoneSchema,
      citizenInternationalPhone: phoneSchema,
      citizenEmailAddress: emailSchema,
    },
    required: ['citizenHomePhone'],
  },
};
