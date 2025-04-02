import {
  arrayBuilderItemSubsequentPageTitleUI,
  currentOrPastMonthYearDateSchema,
  currentOrPastMonthYearDateUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @returns {PageSchema} */
const ratedDisabilityDatePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) => `Start date of ${formData?.ratedDisability} worsening`,
    ),
    // TODO: Can we make just year required?
    // Could use month-optional https://design.va.gov/storybook/?path=/story/components-va-date--month-optional
    // TODO: Why is there the empty option when both are required?
    conditionDate: currentOrPastMonthYearDateUI({
      title: 'What’s the approximate date your disability worsened?',
      hint:
        'For example, if you got a rating for back pain in 2018 but noticed increased issues in late 2020, you would enter December 2020',
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
