import {
  textareaUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI({
      title: 'Explain more',
      headerLevel: 1,
    }),
    trickQuestionExplanation: textareaUI({
      title: 'Why do you think this is a trick question?',
      errorMessages: {
        required: 'Please provide an explanation',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      trickQuestionExplanation: {
        type: 'string',
        maxLength: 1000,
      },
    },
    required: ['trickQuestionExplanation'],
  },
};
