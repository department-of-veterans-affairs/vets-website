import {
  arrayBuilderItemSubsequentPageTitleUI,
  currentOrPastDateSchema,
  currentOrPastDateUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @returns {PageSchema} */
const ratedDisabilityDatePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `Approximate date of ${formData?.ratedDisability} getting worse`,
    ),
    conditionDate: currentOrPastDateUI({
      title: 'Around what date did your disability get worse?',
      hint:
        'You may share an exact date or an approximate date. For example, if you noticed your back pain getting worse in the winter of 2020, you would enter December 1, 2020.',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      conditionDate: currentOrPastDateSchema,
    },
  },
};

export default ratedDisabilityDatePage;
