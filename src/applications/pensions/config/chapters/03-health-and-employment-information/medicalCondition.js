import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { MedicalEvidenceAlert } from '../../../components/FormAlerts';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Medical condition',
    medicalCondition: yesNoUI({
      title: 'Do you have a medical condition that prevents you from working?',
      uswds: true,
      classNames: 'vads-u-margin-bottom--2',
    }),
    'view:warningAlert': {
      'ui:description': MedicalEvidenceAlert,
      'ui:options': {
        hideIf: formData => formData.medicalCondition !== true,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['medicalCondition'],
    properties: {
      medicalCondition: yesNoSchema,
      'view:warningAlert': {
        type: 'object',
        properties: {},
      },
    },
  },
};
