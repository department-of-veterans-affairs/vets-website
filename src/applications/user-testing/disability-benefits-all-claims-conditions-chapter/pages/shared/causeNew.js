import {
  arrayBuilderItemSubsequentPageTitleUI,
  textareaUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { arrayBuilderOptions, createNewConditionName } from './utils';

/** @returns {PageSchema} */
const causeNewPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `Provide details of the injury, event, disease or exposure that caused ${createNewConditionName(
          formData,
        )}`,
    ),
    primaryDescription: textareaUI({
      title:
        'Briefly describe the injury, event, disease or exposure that caused your new condition. ',
      hint:
        'For example, I operated loud machinery while in the service, and this caused me to lose my hearing.',
      updateUiSchema: (_formData, fullData, index) => ({
        'ui:title': `Briefly describe the injury, event, disease or exposure that caused ${createNewConditionName(
          fullData?.[arrayBuilderOptions.arrayPath]?.[index],
        )}.`,
      }),
      charcount: true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      primaryDescription: {
        type: 'string',
        maxLength: 400,
      },
    },
    required: ['primaryDescription'],
  },
};

export default causeNewPage;
