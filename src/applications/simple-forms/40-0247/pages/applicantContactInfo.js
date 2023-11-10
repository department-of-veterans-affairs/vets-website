import {
  titleUI,
  emailSchema,
  emailUI,
  phoneUI,
  phoneSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Tell us how we can reach you if there’s a question about your request',
    ),
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
