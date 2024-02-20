const applicantRelationshipToVetErrors = ['claimant_relationshipToVet'];
const applicantDetailsErrors = [
  'claimant_name_first',
  'claimant_name_last',
  'claimant_ssn',
  'claimant_dateOfBirth',
];
const veteranDetailsErrors = [
  'veteran_currentName_first',
  'veteran_currentName_last',
  'veteran_ssn',
];
const veteranDemographicsErrors = [
  'veteran_gender',
  'veteran_race',
  'veteran_maritalStatus',
];

const veteranDeceasedErrors = ['veteran_isDeceased'];

const veteranMilitaryDetailsErrors = ['veteran_militaryStatus'];
const militaryHistoryErrors = ['veteran_serviceRecords_0_serviceBranch'];
const previousNameErrors1 = ['veteran_view\\:hasServiceName'];
const previousNameErrors2 = [
  'veteran_serviceName_first',
  'veteran_serviceName_last',
];
const burialBenefitsErrors1 = ['hasCurrentlyBuried'];
const burialBenefitsErrors2 = [
  'currentlyBuriedPersons_0_name_first',
  'currentlyBuriedPersons_0_name_last',
];
const applicantContactInfoErrors = [
  'claimant_address_street',
  'claimant_address_city',
  'claimant_address_state',
  'claimant_address_postalCode',
  'claimant_phoneNumber',
  'claimant_email',
];
const preparerInfoErrors1 = ['applicant_applicantRelationshipToClaimant'];
const preparerInfoErrors2 = ['applicant_name_first', 'applicant_name_last'];
const preparerInfoErrors3 = [
  'applicant_view\\:applicantInfo_mailingAddress_street',
  'applicant_view\\:applicantInfo_mailingAddress_city',
  'applicant_view\\:applicantInfo_mailingAddress_state',
  'applicant_view\\:applicantInfo_mailingAddress_postalCode',
  'applicant_view\\:contactInfo_applicantPhoneNumber',
];

module.exports = {
  applicantRelationshipToVetErrors,
  applicantDetailsErrors,
  veteranDetailsErrors,
  veteranDemographicsErrors,
  veteranDeceasedErrors,
  veteranMilitaryDetailsErrors,
  militaryHistoryErrors,
  previousNameErrors1,
  previousNameErrors2,
  burialBenefitsErrors1,
  burialBenefitsErrors2,
  applicantContactInfoErrors,
  preparerInfoErrors1,
  preparerInfoErrors2,
  preparerInfoErrors3,
};
