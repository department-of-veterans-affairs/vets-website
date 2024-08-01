import {
  checkboxGroupSchema,
  checkboxGroupUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

const employmentActivitiesOptions = Object.freeze({
  financial: 'Financial planning',
  home: 'Home care',
  nursing: 'Nursing care',
  funeral: 'Funeral industry',
  medical: 'Medical services',
  consulting: 'Consulting or referral services for Veterans',
  business: 'Business or service that advertises predominately to Veterans',
});

/** @type {PageSchema} */
export default {
  title: 'Employment activities',
  path: 'employment-activities',
  uiSchema: {
    employmentActivities: checkboxGroupUI({
      title:
        'During the past ten years have you been involved in any of the following activities?',
      description:
        'Note: Check all that apply. Failure to identify relevant activities may result in a delay in processing your application.',
      required: true,
      labels: employmentActivitiesOptions,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      employmentActivities: checkboxGroupSchema(
        Object.keys(employmentActivitiesOptions),
      ),
    },
  },
};
