import {
  textUI,
  textSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Other names'),
    'view:otherNamesDescription': {
      'ui:description':
        "To make sure we're able to locate all of your records, it is helpful to identify any other names you have used during your time of military service.",
    },
    otherNames: textUI({
      title: 'List any other names you have used, separated by commas',
      hint: '40 characters allowed',
      charcount: true,
      maxlength: 40,
      errorMessages: {
        maxLength: 'Other names must be 40 characters or less',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:otherNamesDescription': {
        type: 'object',
        properties: {},
      },
      otherNames: textSchema,
    },
    required: [],
  },
};
