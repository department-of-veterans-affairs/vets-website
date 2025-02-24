import {
  titleUI,
  firstNameLastNameNoSuffixUI,
  ssnUI,
  dateOfBirthUI,
} from 'platform/forms-system/src/js/web-component-patterns';

function claimantFormatTitle(name) {
  return `Claimant ${name}`;
}

export default {
  ...titleUI("Claimant's information"),
  claimantFullName: firstNameLastNameNoSuffixUI(claimantFormatTitle),
  claimantSsn: ssnUI('Claimant SSN'),
  claimantDateOfBirth: dateOfBirthUI({
    title: 'Claimant Date of Birth',
  }),
};
