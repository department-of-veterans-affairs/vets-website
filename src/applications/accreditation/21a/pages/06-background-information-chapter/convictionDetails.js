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
  depends: formData => formData.conviction,
  uiSchema: {
    ...titleUI(
      'Provide details for your violation',
      ConvictionDetailsDescription,
    ),
    convictionPlace: textUI('Place of violation or occurrence'),
    convictionDate: currentOrPastDateUI('Date of violation'),
    convictionExplanation: textareaUI('Explanation of violation'),
  },
  schema: {
    type: 'object',
    properties: {
      convictionPlace: textSchema,
      convictionDate: currentOrPastDateSchema,
      convictionExplanation: textareaSchema,
    },
    required: ['convictionPlace', 'convictionDate', 'convictionExplanation'],
  },
};
