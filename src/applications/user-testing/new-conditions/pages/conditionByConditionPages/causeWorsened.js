import {
  arrayBuilderItemSubsequentPageTitleUI,
  textareaUI,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { createItemName } from './utils';

/** @returns {PageSchema} */
const causeWorsenedPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `Details of the injury, event or exposure that worsened ${createItemName(
          formData,
        )}`,
    ),
    worsenedDescription: textUI({
      title:
        'Briefly describe the injury, event or exposure during your military service that caused your new condition to get worse.',
      charcount: true,
    }),
    worsenedEffects: textareaUI({
      title:
        'Tell us how this new condition affected you before your service, and how it affects you now after your service.',
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
