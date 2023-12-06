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
    homePhone: phoneUI('Phone number'),
    emailAddress: emailUI(),
  },
  schema: {
    type: 'object',
    properties: {
      homePhone: phoneSchema,
      emailAddress: emailSchema,
    },
    required: ['homePhone'],
  },
};
