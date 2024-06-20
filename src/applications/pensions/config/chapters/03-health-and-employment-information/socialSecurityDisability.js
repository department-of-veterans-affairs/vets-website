import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import { MedicalEvidenceAlert } from '../../../components/FormAlerts';

const { socialSecurityDisability } = fullSchemaPensions.properties;

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
      socialSecurityDisability,
      'view:warningAlert': {
        type: 'object',
        properties: {},
      },
    },
  },
};
