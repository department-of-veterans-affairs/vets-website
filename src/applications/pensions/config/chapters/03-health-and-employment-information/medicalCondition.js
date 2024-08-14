import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import { MedicalEvidenceAlert } from '../../../components/FormAlerts';
import { hasNoSocialSecurityDisability } from './helpers';
import { showMedicalEvidenceClarification } from '../../../helpers';

// TODO: Remove this page when pension_medical_evidence_clarification flipper is removed

const path = !showMedicalEvidenceClarification()
  ? 'medical/history/condition'
  : 'temporarily-hidden-condition';

const { medicalCondition } = fullSchemaPensions.properties;
/** @type {PageSchema} */
export default {
  title: 'Medical condition',
  path,
  depends: form =>
    hasNoSocialSecurityDisability(form) && !showMedicalEvidenceClarification(),
  uiSchema: {
    ...titleUI('Medical condition'),
    medicalCondition: yesNoUI({
      title: 'Do you have a medical condition that prevents you from working?',
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
      medicalCondition,
      'view:warningAlert': {
        type: 'object',
        properties: {},
      },
    },
  },
};
