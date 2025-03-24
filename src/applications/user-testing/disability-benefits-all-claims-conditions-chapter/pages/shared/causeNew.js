import {
  arrayBuilderItemSubsequentPageTitleUI,
  textareaUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { createNewConditionName } from './utils';

/** @returns {PageSchema} */
const causeNewPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `Details of injury, event, disease or exposure that caused ${createNewConditionName(
          formData,
        )}`,
    ),
    primaryDescription: textareaUI({
      title:
        'Briefly describe the injury, event, disease or exposure that caused your new condition. ',
      hint:
        'For example, I operated loud machinery while in the service, and this caused me to lose my hearing.',
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
