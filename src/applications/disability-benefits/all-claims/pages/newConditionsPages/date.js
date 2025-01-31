import {
  arrayBuilderItemSubsequentPageTitleUI,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { createItemName } from './utils';

/** @returns {PageSchema} */
const datePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) => `Date of ${createItemName(formData)}`,
    ),
    date: textUI({
      title:
        'What is the approximate date this condition began? If you’re having trouble remembering the exact date you can provide a year.',
      hint: 'For example: January 2004 or 2004',
      charcount: true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      date: {
        type: 'string',
        maxLength: 25,
      },
    },
    required: ['date'],
  },
};

export default datePage;
