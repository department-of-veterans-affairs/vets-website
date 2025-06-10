import {
  arrayBuilderItemSubsequentPageTitleUI,
  currentOrPastDateSchema,
  currentOrPastDateUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { ForceFieldBlur, validateApproximateDate } from './utils';

const baseDateUI = currentOrPastDateUI({
  title: 'Around what date did your disability get worse?',
  hint:
    'You may share an exact date or an approximate date. For example, if you noticed your back pain getting worse in the winter of 2020, you would enter December 1, 2020.',
});

/** @returns {PageSchema} */
const ratedDisabilityDatePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `Approximate date of ${formData?.ratedDisability ||
          'service-connected disability'} worsening`,
    ),
    conditionDate: {
      ...baseDateUI,
      'ui:validations': [validateApproximateDate],
    },
    // Aim is to trigger internal VA form field update logic
    _forceFieldBlur: {
      'ui:field': ForceFieldBlur,
    },
  },
  schema: {
    type: 'object',
    properties: {
      conditionDate: currentOrPastDateSchema,
      _forceFieldBlur: { type: 'boolean' }, // Required for ForceFieldBlur to render
    },
  },
};

export default ratedDisabilityDatePage;
