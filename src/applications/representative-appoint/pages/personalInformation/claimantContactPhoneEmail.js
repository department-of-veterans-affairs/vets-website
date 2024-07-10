import {
  phoneUI,
  phoneSchema,
  emailUI,
  emailSchema,
  titleUI,
  titleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const blankSchema = { type: 'object', properties: {} };

export const uiSchema = {
  ...titleUI('Your phone number and email address'),
  applicantPhone: phoneUI({
    required: true,
  }),
  applicantEmail: emailUI,
};

export const schema = {
  type: 'object',
  required: ['applicantDOB'],
  properties: {
    titleSchema,
    applicantPhone: phoneSchema,
    applicantEmail: emailSchema,
  },
};
