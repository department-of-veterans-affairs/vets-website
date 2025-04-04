import {
  arrayBuilderItemSubsequentPageTitleUI,
  currentOrPastDateSchema,
  currentOrPastDateUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { createNewConditionName } from './utils';

/** @returns {PageSchema} */
const newConditionDatePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `Approximate start date of ${createNewConditionName(formData)}`,
    ),
    conditionDate: currentOrPastDateUI({
      title: 'What’s the approximate date your condition started?',
      hint: 'For example, summer of 1988 can be entered as June 1, 1988.',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      conditionDate: currentOrPastDateSchema,
    },
  },
};

export default newConditionDatePage;
