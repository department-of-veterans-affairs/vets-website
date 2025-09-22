import {
  arrayBuilderItemSubsequentPageTitleUI,
  textareaUI,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { arrayBuilderOptions, createNewConditionName } from './utils';

/** @returns {PageSchema} */
const causeWorsenedPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) => createNewConditionName(formData, true),
      undefined,
      false,
    ),
    worsenedDescription: textUI({
      title:
        'Briefly describe the injury, event or exposure during your military service that caused your condition to get worse.',
      updateUiSchema: (_formData, fullData, index) => ({
        'ui:title': `Briefly describe the injury, event or exposure during your military service that caused your ${createNewConditionName(
          fullData?.[arrayBuilderOptions.arrayPath]?.[index],
        )} to get worse.`,
      }),
      charcount: true,
    }),
    worsenedEffects: textareaUI({
      title:
        'Tell us how your condition affected you before your service and how it affects you now after your service.',
      updateUiSchema: (_formData, fullData, index) => ({
        'ui:title': `Tell us how ${createNewConditionName(
          fullData?.[arrayBuilderOptions.arrayPath]?.[index],
        )} affected you before your service, and how it affects you now after your service.`,
      }),
      charcount: true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      worsenedDescription: {
        type: 'string',
        maxLength: 50,
      },
      worsenedEffects: {
        type: 'string',
        maxLength: 350,
      },
    },
    required: ['worsenedDescription', 'worsenedEffects'],
  },
};

export default causeWorsenedPage;
