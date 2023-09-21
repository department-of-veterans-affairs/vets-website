import {
  emailSchema,
  emailUI,
  phoneUI,
  phoneSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    applicantPhone: phoneUI(),
    applicantEmail: emailUI(),
  },
  schema: {
    type: 'object',
    properties: {
      applicantPhone: phoneSchema,
      applicantEmail: emailSchema,
    },
    required: ['applicantPhone'],
  },
};
