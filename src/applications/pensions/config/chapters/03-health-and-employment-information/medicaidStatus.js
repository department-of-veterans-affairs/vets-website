import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import { RequestNursingHomeInformationAlert } from '../../../components/FormAlerts';
import { medicaidDoesNotCoverNursingHome } from './helpers';

const { medicaidStatus } = fullSchemaPensions.properties;

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
      medicaidStatus,
      'view:warningAlert': {
        type: 'object',
        properties: {},
      },
    },
  },
};
