import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { MedicalEvidenceAlert } from '../../../components/FormAlerts';

/** @type {PageSchema} */
export default {
  title: 'Social Security disability',
  path: 'medical/history/social-security-disability',
  depends: formData => !formData.isOver65,
  uiSchema: {
    ...titleUI('Social Security disability'),
    socialSecurityDisability: yesNoUI({
      title: 'Do you currently receive Social Security disability payments?',
      classNames: 'vads-u-margin-bottom--2',
    }),
    'view:warningAlert': {
      'ui:description': MedicalEvidenceAlert,
      'ui:options': {
        hideIf: formData => formData.socialSecurityDisability !== false,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['socialSecurityDisability'],
    properties: {
      socialSecurityDisability: yesNoSchema,
      'view:warningAlert': {
        type: 'object',
        properties: {},
      },
    },
  },
};
