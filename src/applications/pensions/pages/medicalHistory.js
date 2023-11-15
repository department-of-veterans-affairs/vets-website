import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { medicalEvidenceAlert } from '../components/FormAlerts';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Social Security disability',
    medicalHistory: yesNoUI({
      title: 'Do you have a medical condition that prevents you from working?',
      uswds: true,
      classNames: 'vads-u-margin-bottom--2',
    }),
    'view:warningAlert': {
      'ui:description': medicalEvidenceAlert,
      'ui:options': {
        hideIf: formData => formData.medicalHistory !== true,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['medicalHistory'],
    properties: {
      medicalHistory: yesNoSchema,
      'view:warningAlert': {
        type: 'object',
        properties: {},
      },
    },
  },
};
