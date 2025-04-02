import {
  arrayBuilderItemSubsequentPageTitleUI,
  currentOrPastMonthYearDateSchema,
  currentOrPastMonthYearDateUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @returns {PageSchema} */
const ratedDisabilityDatePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `Tell us the approximate date of ${
          formData?.ratedDisability
        } getting worse`,
    ),
    // TODO: Can we make just year required?
    // Could use month-optional https://design.va.gov/storybook/?path=/story/components-va-date--month-optional
    // TODO: Why is there the empty option when both are required?
    conditionDate: currentOrPastMonthYearDateUI({
      title: 'Around what date did your disability get worse?',
      hint:
        'You may share an exact date or an approximate date. For example, if you noticed your back pain getting worse in the winter of 2020, you would enter December 1, 2020.',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      conditionDate: currentOrPastMonthYearDateSchema,
    },
  },
};

export default ratedDisabilityDatePage;
