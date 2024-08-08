import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import { MedicalEvidenceAlert } from '../../../components/FormAlerts';
import { showMedicalEvidenceClarification } from '../../../helpers';

const { socialSecurityDisability } = fullSchemaPensions.properties;

// TODO: Remove this page when pension_medical_evidence_clarification flipper is removed

const path = !showMedicalEvidenceClarification()
  ? 'medical/history/social-security-disability'
  : 'temporarily-hidden';

/** @type {PageSchema} */
export default {
  title: 'Social Security disability',
  path,
  depends: formData =>
    !formData.isOver65 && !showMedicalEvidenceClarification(),
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
