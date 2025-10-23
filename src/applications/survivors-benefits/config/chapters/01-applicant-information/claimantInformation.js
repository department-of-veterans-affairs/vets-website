import {
  titleUI,
  fullNameSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { benefitsIntakeFullNameUI } from './helpers';

/** @type {PageSchema} */
export default {
  title: 'Claimant information',
  path: 'applicant/claimant/information',
  depends: formData => formData.claimantNotVeteran === true,
  uiSchema: {
    ...titleUI('Claimant information'),
    claimantFullName: benefitsIntakeFullNameUI(),
  },
  schema: {
    type: 'object',
    required: ['claimantFullName'],
    properties: {
      claimantFullName: fullNameSchema,
    },
  },
};
