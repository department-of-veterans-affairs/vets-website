import {
  ssnUI,
  ssnSchema,
  titleUI,
  emailUI,
  emailSchema,
  phoneSchema,
  phoneUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Web component v3'),
    wcv3TextEmailNew: emailUI({
      description:
        'By providing an email address, I agree to receive electronic correspondence from VA regarding my application',
    }),
    wcv3TextPhoneNew: phoneUI(),
    wcv3TextSsnNew: ssnUI(),
  },
  schema: {
    type: 'object',
    properties: {
      wcv3TextEmailNew: emailSchema,
      wcv3TextPhoneNew: phoneSchema,
      wcv3TextSsnNew: ssnSchema,
    },
    required: ['wcv3TextEmailNew'],
  },
};
