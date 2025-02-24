import {
  firstNameLastNameNoSuffixSchema,
  ssnSchema,
  dateOfBirthSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  claimantFullName: firstNameLastNameNoSuffixSchema,
  claimantSsn: ssnSchema,
  claimantDateOfBirth: dateOfBirthSchema,
};
