import {
  arrayBuilderItemSubsequentPageTitleUI,
  textareaUI,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { createItemName } from './utils';

/** @returns {PageSchema} */
const causeVAPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `Details of the injury or event in VA care that caused ${createItemName(
          formData,
        )}`,
    ),
    vaMistreatmentDescription: textareaUI({
      title:
        'Briefly describe the injury or event in VA care that caused your new condition.',
      charcount: true,
    }),
    vaMistreatmentLocation: textUI({
      title: 'Tell us where this happened.',
      charcount: true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      vaMistreatmentDescription: {
        type: 'string',
        maxLength: 350,
      },
      vaMistreatmentLocation: {
        type: 'string',
        maxLength: 25,
      },
    },
    required: ['vaMistreatmentDescription', 'vaMistreatmentLocation'],
  },
};

export default causeVAPage;
