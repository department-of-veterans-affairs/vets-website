import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { RequestNursingHomeInformationAlert } from '../../../components/FormAlerts';
import { medicaidDoesNotCoverNursingHome } from './helpers';

/** @type {PageSchema} */
export default {
  title: 'Medicaid application status',
  path: 'medical/history/nursing/medicaid/status',
  depends: medicaidDoesNotCoverNursingHome,
  uiSchema: {
    ...titleUI('Medicaid application status'),
    medicaidStatus: yesNoUI({
      title: 'Have you applied for Medicaid?',
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
