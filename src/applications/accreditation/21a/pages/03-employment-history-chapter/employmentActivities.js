import {
  checkboxGroupUI,
  checkboxGroupSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';

const employmentActivitiesOptions = Object.freeze({
  financial: 'Financial Planning',
  home: 'Home care',
  nursing: 'Nursing care',
  funeral: 'Funeral industry',
  medical: 'Medical services',
  consulting: 'Consulting or referral services for Veterans',
  business: 'Business or service that advertises predominately to Veterans',
});

const employmentActivities = {
  uiSchema: {
    activities: checkboxGroupUI({
      title:
        'During the past ten years have you been involved in any of the following activities? Failure to identify relevant activities may result in a delay in processing your application.',
      hint: 'Check all that apply',
      required: true,
      labels: employmentActivitiesOptions,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      activities: checkboxGroupSchema(Object.keys(employmentActivitiesOptions)),
    },
  },
};

const employmentActivitiesPage = {
  title: 'Employment Activities',
  path: 'employers/activities',
  uiSchema: employmentActivities.uiSchema,
  schema: employmentActivities.schema,
};

export default employmentActivitiesPage;
