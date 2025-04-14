import {
  arrayBuilderItemSubsequentPageTitleUI,
  textareaUI,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { arrayBuilderOptions, createNewConditionName } from './utils';

/** @returns {PageSchema} */
const causeVAPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `Details of the injury or event in VA care that caused ${createNewConditionName(
          formData,
        )}`,
    ),
    vaMistreatmentDescription: textareaUI({
      title:
        'Briefly describe the injury or event in VA care that caused your new condition.',
      updateUiSchema: (_formData, fullData, index) => ({
        'ui:title': `Briefly describe the injury or event in VA care that caused your ${createNewConditionName(
          fullData?.[arrayBuilderOptions.arrayPath]?.[index],
        )}.`,
      }),
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
