import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import {
  MedicalConditionDescription,
  hasNoSocialSecurityDisability,
} from './helpers';
import { showMedicalEvidenceClarification } from '../../../helpers';

const path = showMedicalEvidenceClarification()
  ? 'medical/history/condition'
  : 'temporarily-hide';

const { medicalCondition } = fullSchemaPensions.properties;
/** @type {PageSchema} */
export default {
  title: 'Medical condition',
  path,
  depends: form =>
    hasNoSocialSecurityDisability(form) && showMedicalEvidenceClarification(),
  uiSchema: {
    ...titleUI('Tell us about any medical conditions'),
    'ui:description': MedicalConditionDescription,
    medicalCondition: yesNoUI({
      title: 'Do you have a medical condition that prevents you from working?',
      hint:
        "Your answer to this question helps us determine if you're eligible for Veterans Pension benefits. We consider your age, income, and medical history in our determination.",
      classNames: 'vads-u-margin-bottom--2',
    }),
  },
  schema: {
    type: 'object',
    required: ['medicalCondition'],
    properties: {
      medicalCondition,
    },
  },
};
