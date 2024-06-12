import {
  emailSchema,
  emailUI,
  phoneSchema,
  phoneUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Contact information',
  path: 'contact-information',
  uiSchema: {
    ...titleUI('Contact information'),
    personalPhone: phoneUI('Primary number'),
    personalEmail: emailUI(),
  },
  schema: {
    type: 'object',
    required: ['personalPhone'],
    properties: {
      personalPhone: phoneSchema,
      personalEmail: emailSchema,
    },
  },
};
