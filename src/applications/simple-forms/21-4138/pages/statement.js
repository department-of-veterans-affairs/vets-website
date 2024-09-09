import {
  textareaUI,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export const statementPage = {
  uiSchema: {
    ...titleUI({
      title: 'Provide your statement',
      description:
        'If we gave you any instructions for submitting this statement, please do your best to follow them. This will help us make sure the statement is processed smoothly.',
      headerLevel: 1,
    }),
    statement: textareaUI({
      title: 'Your statement',
      charcount: true,
      errorMessages: {
        required: 'Enter the statement',
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['statement'],
    properties: {
      statement: {
        type: 'string',
        maxLength: 3650,
      },
    },
  },
};
