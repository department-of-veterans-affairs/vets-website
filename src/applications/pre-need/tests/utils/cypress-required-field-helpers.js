function errorMap(errorList) {
  errorList.map(id =>
    cy.get(`#root_application_${id}-error-message`).should('be.visible'),
  );
}

const applicantInfoErrors = [
  'claimant_name_first',
  'claimant_name_last',
  'claimant_ssn',
  'claimant_dateOfBirth',
  'claimant_relationshipToVet',
];
const veteranInfoErrors = [
  'veteran_currentName_first',
  'veteran_currentName_last',
  'veteran_ssn',
  'veteran_gender',
  'veteran_race',
  'veteran_maritalStatus',
  'veteran_militaryStatus',
  'veteran_isDeceased',
];
module.exports = {
  errorMap,
  applicantInfoErrors,
  veteranInfoErrors,
};
