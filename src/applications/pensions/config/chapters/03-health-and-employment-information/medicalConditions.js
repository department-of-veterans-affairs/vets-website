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
  : 'temporarily-hidden-conditions';

const { medicalCondition } = fullSchemaPensions.properties;
/** @type {PageSchema} */
export default {
  title: 'Medical condition',
  path,
  depends: form =>
    hasNoSocialSecurityDisability(form) && showMedicalEvidenceClarification(),
  uiSchema: {
    ...titleUI(
      'Tell us if you have a medical condition that prevents you from working',
    ),
    'ui:description': MedicalConditionDescription,
    medicalCondition: yesNoUI({
      title: 'Do you have a medical condition that prevents you from working?',
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
