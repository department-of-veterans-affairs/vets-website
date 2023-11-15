import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { medicalEvidenceAlert } from '../components/FormAlerts';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Social Security disability',
    socialSecurityDisabilityHistory: yesNoUI({
      title: 'Do you currently receive Social Security disability payments?',
      uswds: true,
      classNames: 'vads-u-margin-bottom--2',
    }),
    'view:warningAlert': {
      'ui:description': medicalEvidenceAlert,
      'ui:options': {
        hideIf: formData => formData.socialSecurityDisabilityHistory !== false,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['socialSecurityDisabilityHistory'],
    properties: {
      socialSecurityDisabilityHistory: yesNoSchema,
      'view:warningAlert': {
        type: 'object',
        properties: {},
      },
    },
  },
};
