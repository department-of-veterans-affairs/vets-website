import {
  textareaSchema,
  textareaUI,
  inlineTitleUI,
  inlineTitleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Supplemental statements',
  path: 'supplementary-statements',
  uiSchema: {
    supplementalTitle: inlineTitleUI('Optional supplemental statement'),
    supplementalStatement: textareaUI(
      'Provide any necessary explanation for your answers and include the associated question number.',
    ),
    personalTitle: inlineTitleUI('Optional personal statement'),
    personalStatement: textareaUI(
      'If you would like to, you may provide additional information for consideration such as a personal statement explaining why you are interested in VA accreditation.',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      supplementalTitle: inlineTitleSchema,
      supplementalStatement: textareaSchema,
      personalTitle: inlineTitleSchema,
      personalStatement: textareaSchema,
    },
  },
};
