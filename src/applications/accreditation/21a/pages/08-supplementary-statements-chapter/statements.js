import {
  textareaSchema,
  textareaUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Supplementary statements',
  path: 'supplementary-statements',
  uiSchema: {
    supplementalStatement: textareaUI({
      title: 'Optional supplemental statement',
      labelHeaderLevel: 3,
      description:
        'Provide any necessary explanation for your answers and include the associated question number.',
    }),
    personalStatement: textareaUI({
      title: 'Optional personal statement',
      labelHeaderLevel: 3,
      description:
        'If you would like to, you may provide additional information for consideration such as a personal statement explaining why you are interested in VA accreditation.',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      supplementalStatement: textareaSchema,
      personalStatement: textareaSchema,
    },
  },
};
