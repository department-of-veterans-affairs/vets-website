import {
  checkboxGroupSchema,
  checkboxGroupUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

import EmploymentActivitiesDescription from '../../components/03-employment-history-chapter/EmploymentActivitiesDescription';

const employmentActivitiesOptions = Object.freeze({
  FINANCIAL: 'Financial planning',
  HOME: 'Home care',
  NURSING: 'Nursing care',
  FUNERAL: 'Funeral industry',
  MEDICAL: 'Medical services',
  CONSULTING: 'Consulting or referral services for Veterans',
  BUSINESS: 'Business or service that advertises predominately to Veterans',
});

/** @type {PageSchema} */
export default {
  title: 'Employment activities',
  path: 'employment-activities',
  uiSchema: {
    employmentActivities: checkboxGroupUI({
      title:
        'During the past ten years have you been involved in any of the following activities?',
      description: EmploymentActivitiesDescription,
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
