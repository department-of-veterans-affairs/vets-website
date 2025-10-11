import {
  titleUI,
  fullNameSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { prefixedFullNameUI } from '../../definitions';

/** @type {PageSchema} */
export default {
  title: 'Your information',
  path: 'applicant/claimant/information',
  // depends: formData => formData.claimantNotVeteran === true,
  uiSchema: {
    ...titleUI(
      'Your information',
      'You aren’t required to fill in all fields, but we can review your application faster if you provide more information.',
    ),
    claimantFullName: prefixedFullNameUI({ label: 'Your' }),
  },
  schema: {
    type: 'object',
    required: ['claimantFullName'],
    properties: {
      claimantFullName: fullNameSchema,
    },
  },
};
