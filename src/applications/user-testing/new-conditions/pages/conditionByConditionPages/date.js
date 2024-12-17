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
    // TODO: Can we make just year required?
    // Could use month-optional https://design.va.gov/storybook/?path=/story/components-va-date--month-optional
    // TODO: Why is there the empty option when both are required?
    date: currentOrPastMonthYearDateUI({
      title: 'What’s the approximate date your condition started?',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      date: currentOrPastMonthYearDateSchema,
    },
    required: ['date'],
  },
};

export default datePage;
