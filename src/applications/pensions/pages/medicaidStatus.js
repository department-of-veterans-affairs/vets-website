import {
  yesNoSchema,
  yesNoUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { RequestNursingHomeInformationAlert } from '../components/FormAlerts';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Medicaid application status',
    medicaidStatus: yesNoUI({
      title: 'Have you applied for Medicaid?',
      uswds: true,
    }),
    'view:warningAlert': {
      'ui:description': RequestNursingHomeInformationAlert,
      'ui:options': {
        hideIf: formData => formData.medicaidStatus !== true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      medicaidStatus: yesNoSchema,
      'view:warningAlert': {
        type: 'object',
        properties: {},
      },
    },
  },
};
