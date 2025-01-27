import {
  checkboxGroupSchema,
  checkboxGroupUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

import EmploymentActivitiesDescription from '../../components/03-employment-information-chapter/EmploymentActivitiesDescription';
import { employmentActivitiesOptions } from '../../constants/options';

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
