import {
  arrayBuilderItemSubsequentPageTitleUI,
  currentOrPastMonthYearDateSchema,
  currentOrPastMonthYearDateUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { createNewConditionName } from './utils';

/** @returns {PageSchema} */
const newConditionDatePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `Tell us the approximate start date of ${createNewConditionName(
          formData,
        )}`,
    ),
    conditionDate: currentOrPastMonthYearDateUI({
      title: 'What’s the approximate date your condition started?',
      hint: 'For example, summer of 1988 can be entered as June 1988.',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      conditionDate: currentOrPastMonthYearDateSchema,
    },
  },
};

export default newConditionDatePage;
