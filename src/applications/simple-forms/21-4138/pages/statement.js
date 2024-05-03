// import { titleUI } from '~/platform/forms-system/src/js/web-component-patterns';
import VaTextareaField from '~/platform/forms-system/src/js/web-component-fields/VaTextareaField';

/** @type {PageSchema} */
export const statementPage = {
  uiSchema: {
    statement: {
      'ui:title': 'Provide your statement',
      'ui:description':
        'If we gave you any instructions for submitting this statement, please do your best to follow them. This will help us make sure the statement is processed smoothly.',
      'ui:webComponentField': VaTextareaField,
      'ui:options': {
        maxLength: 5000,
        charcount: true,
        labelHeaderLevel: '1',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['statement'],
    maxLength: 5000,
    properties: {
      statement: {
        type: 'string',
      },
    },
  },
};
