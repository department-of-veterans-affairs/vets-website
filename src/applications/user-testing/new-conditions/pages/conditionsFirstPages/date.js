import {
  arrayBuilderItemSubsequentPageTitleUI,
  currentOrPastMonthYearDateSchema,
  currentOrPastMonthYearDateUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { createItemName } from './utils';

/** @returns {PageSchema} */
const datePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) => `Start date of ${createItemName(formData)}`,
    ),
    date: currentOrPastMonthYearDateUI({
      title: 'What’s the approximate date your condition started?',
      hint: 'For example: January 2004 or 2004',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      date: currentOrPastMonthYearDateSchema(),
    },
    required: ['date'],
  },
};

export default datePage;
