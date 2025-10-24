import {
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  dateOfBirthUI,
  dateOfBirthSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import ClaimantPersInfoUiTitle from '../components/ClaimantPersInfoUiTitle';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(ClaimantPersInfoUiTitle),
    claimantFullName: fullNameNoSuffixUI(),
    claimantDateOfBirth: dateOfBirthUI(),
  },
  schema: {
    type: 'object',
    required: ['claimantFullName', 'claimantDateOfBirth'],
    properties: {
      claimantFullName: fullNameNoSuffixSchema,
      claimantDateOfBirth: dateOfBirthSchema,
    },
  },
};
