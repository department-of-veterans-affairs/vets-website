import {
  currentOrPastDateSchema,
  currentOrPastDateUI,
  textSchema,
  textUI,
  textareaSchema,
  textareaUI,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

import ConvictionDetailsDescription from '../../components/ConvictionDetailsDescription';

/** @type {PageSchema} */
export default {
  title: 'Conviction details',
  path: 'conviction-details',
  depends: formData => formData.convictions,
  uiSchema: {
    ...titleUI(
      'Provide details for your violation',
      ConvictionDetailsDescription,
    ),
    placeOfViolation: textUI('Place of violation or occurrence'),
    violationDate: currentOrPastDateUI('Date of violation'),
    violationExplanation: textareaUI('Explanation of violation'),
  },
  schema: {
    type: 'object',
    properties: {
      placeOfViolation: textSchema,
      violationDate: currentOrPastDateSchema,
      violationExplanation: textareaSchema,
    },
    required: ['placeOfViolation', 'violationDate', 'violationExplanation'],
  },
};
