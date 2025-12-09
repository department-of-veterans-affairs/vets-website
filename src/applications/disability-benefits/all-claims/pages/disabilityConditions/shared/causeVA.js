import {
  arrayBuilderItemSubsequentPageTitleUI,
  textareaUI,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { createNewConditionName } from '../../../content/conditions';
import { arrayOptions } from './utils';

/** @returns {PageSchema} */
const causeVAPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) => createNewConditionName(formData, true),
      undefined,
      false,
    ),
    vaMistreatmentDescription: textareaUI({
      title:
        'Briefly describe the injury or event in VA care that caused your condition.',
      updateUiSchema: (_formData, fullData, index) => ({
        'ui:title': `Briefly describe the injury or event in VA care that caused your ${createNewConditionName(
          fullData?.[arrayOptions.arrayPath]?.[index],
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
