import {
  arrayBuilderItemSubsequentPageTitleUI,
  currentOrPastDateSchema,
  currentOrPastDateUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  createNewConditionName,
  ForceFieldBlur,
  validateApproximateDate,
} from './utils';

const baseDateUI = currentOrPastDateUI({
  title: 'What’s the approximate date your condition started?',
  hint: 'For example, summer of 1988 can be entered as June 1, 1988.',
});

/** @returns {PageSchema} */
const newConditionDatePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `Approximate start date of condition: ${createNewConditionName(
          formData,
        )}`,
    ),
    conditionDate: {
      ...baseDateUI,
      'ui:validations': [validateApproximateDate],
    },
    _forceFieldBlur: {
      'ui:field': ForceFieldBlur,
    },
  },
  schema: {
    type: 'object',
    properties: {
      conditionDate: currentOrPastDateSchema,
      _forceFieldBlur: { type: 'boolean' },
    },
  },
};

export default newConditionDatePage;
