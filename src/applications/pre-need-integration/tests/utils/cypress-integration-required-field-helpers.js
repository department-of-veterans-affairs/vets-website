const preparerInfoErrors1 = ['applicant_applicantRelationshipToClaimant'];
const preparerInfoErrors2 = ['applicant_name_first', 'applicant_name_last'];
const preparerInfoErrors3 = [
  'applicant_view\\:applicantInfo_mailingAddress_street',
  'applicant_view\\:applicantInfo_mailingAddress_city',
  'applicant_view\\:applicantInfo_mailingAddress_state',
  'applicant_view\\:applicantInfo_mailingAddress_postalCode',
  'applicant_view\\:contactInfo_applicantPhoneNumber',
  'applicant_view\\:contactInfo_applicantEmail',
];
const applicantRelationshipToVetErrors = ['claimant_relationshipToVet'];
const applicantDetailsErrors = [
  'claimant_name_first',
  'claimant_name_last',
  'claimant_ssn',
  'claimant_dateOfBirth',
];
const applicantContactInfoErrors = [
  'claimant_address_street',
  'claimant_address_city',
  'claimant_address_state',
  'claimant_address_postalCode',
  'claimant_phoneNumber',
  'claimant_email',
];
const veteranDetailsErrors1 = ['applicant_isSponsor'];
const veteranDetailsErrors2 = [
  'veteran_currentName_first',
  'veteran_currentName_last',
  'veteran_ssn',
];
const veteranDeceasedErrors = ['veteran_isDeceased'];
const veteranDemographicsErrors1 = ['veteran_maritalStatus', 'veteran_gender'];
const veteranDemographicsErrors2 = ['veteran_ethnicity'];
const veteranDemographicsErrors3 = ['veteran_raceComment'];
const previousNameErrors1 = ['veteran_view\\:hasServiceName'];
const previousNameErrors2 = [
  'veteran_serviceName_first',
  'veteran_serviceName_last',
];
const burialBenefitsErrors = ['hasCurrentlyBuried'];
const preferredCemeteryErrors = ['claimant_desiredCemetery'];

module.exports = {
  applicantRelationshipToVetErrors,
  applicantDetailsErrors,
  veteranDetailsErrors1,
  veteranDetailsErrors2,
  veteranDemographicsErrors1,
  veteranDemographicsErrors2,
  veteranDemographicsErrors3,
  veteranDeceasedErrors,
  previousNameErrors1,
  previousNameErrors2,
  burialBenefitsErrors,
  preferredCemeteryErrors,
  applicantContactInfoErrors,
  preparerInfoErrors1,
  preparerInfoErrors2,
  preparerInfoErrors3,
};
