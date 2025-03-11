import {
  titleUI,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Organization to disclose information to'),
    organizationName: textUI({
      title: 'Organization’s name',
      errorMessages: {
        required: 'Please enter the name of the organization',
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['organizationName'],
    properties: {
      organizationName: textSchema,
    },
  },
};
