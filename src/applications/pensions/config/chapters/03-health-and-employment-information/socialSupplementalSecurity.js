import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import { showMedicalEvidenceClarification } from '../../../helpers';

const { socialSecurityDisability } = fullSchemaPensions.properties;

const path = showMedicalEvidenceClarification()
  ? 'medical/history/social-security-disability'
  : 'temporarily-hidden-social-security-disability';

/** @type {PageSchema} */
export default {
  title: 'Social Security or Supplement Security payments',
  path,
  depends: formData => !formData.isOver65 && showMedicalEvidenceClarification(),
  uiSchema: {
    ...titleUI(
      'Tell us about any Social Security or Supplement Security payments',
    ),
    socialSecurityDisability: yesNoUI({
      title:
        'Do you receive Social Security Disability Insurance or Supplemental Security Income?',
      hint:
        "Your answer to this question helps us determine if you're eligible for Veterans Pension benefits. We consider your age, income, and medical history in our determination.",
      classNames: 'vads-u-margin-bottom--2',
    }),
  },
  schema: {
    type: 'object',
    required: ['socialSecurityDisability'],
    properties: {
      socialSecurityDisability,
    },
  },
};
