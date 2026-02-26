export const veteranFields = {
  parentObject: 'veteran',
  fullName: 'fullName',
  dateOfBirth: 'dateOfBirth',
  ssn: 'ssn',
  vaFileNumber: 'vaFileNumber',
  veteranServiceNumber: 'veteranServiceNumber',
  address: 'address',
  homePhone: 'homePhone',
  alternatePhone: 'alternatePhone',
  email: 'email',
};

export const providerFacilityFields = {
  parentObject: 'providerFacility',
  providerFacilityName: 'providerFacilityName',
  conditionsTreated: 'conditionsTreated',
  treatmentDateRange: 'treatmentDateRange',
  providerFacilityAddress: 'providerFacilityAddress',
};

export const employmentAppliedFields = {
  parentObject: 'employmentHistory',
  employerName: 'employerName',
  employerAddress: 'employerAddress',
  typeOfWork: 'typeOfWork',
  dateApplied: 'dateApplied',
  hasTriedEmployment: 'hasTriedEmployment',
};

export const doctorCareQuestionFields = {
  parentObject: 'doctorCareQuestion',
  hasReceivedDoctorCare: 'hasReceivedDoctorCare',
};
export const hospitalizationQuestionFields = {
  parentObject: 'hospitalizationQuestion',
  hasBeenHospitalized: 'hasBeenHospitalized',
};

export const employedByVAFields = {
  parentObject: 'employedByVA',
  isEmployedByVA: 'isEmployedByVA',
  employerName: 'employerName',
  employerAddress: 'employerAddress',
  typeOfWork: 'typeOfWork',
  hoursPerWeek: 'hoursPerWeek',
  datesOfEmployment: 'datesOfEmployment',
  lostTime: 'lostTime',
  highestIncome: 'highestIncome',

  /* For certification portion */

  hasCertifiedSection2: 'hasCertifiedSection2',
  hasUnderstoodSection2: 'hasUnderstoodSection2',

  hasCertifiedSection3: 'hasCertifiedSection3',
  hasUnderstoodSection3: 'hasUnderstoodSection3',
};

export const medicalCareFields = {
  parentObject: 'medicalCare',
  hasRecentMedicalCare: 'hasRecentMedicalCare',
};

export const medicalTreatmentRecordsFields = {
  parentObject: 'medicalTreatmentRecords',
  doctorName: 'doctorName',
  doctorAddress: 'doctorAddress',
  hospitalName: 'hospitalName',
  hospitalAddress: 'hospitalAddress',
  treatmentDates: 'treatmentDates',
  hospitalizationDates: 'hospitalizationDates',
};

export const preparerIdentificationFields = {
  parentObject: 'preparerIdentification',
  relationshipToVeteran: 'relationshipToVeteran',
  preparerFullName: 'preparerFullName',
  preparerTitle: 'preparerTitle',
  preparerOrganization: 'preparerOrganization',
  courtAppointmentInfo: 'courtAppointmentInfo',
  preparerHasSameAddressAsVeteran: 'view:preparerHasSameAddressAsVeteran',
  preparerAddress: 'preparerAddress',
};
export const patientIdentificationFields = {
  parentObject: 'patientIdentification',
  isRequestingOwnMedicalRecords: 'isRequestingOwnMedicalRecords',
  patientFullName: 'patientFullName',
  patientSsn: 'patientSsn',
  patientVaFileNumber: 'patientVaFileNumber',
};
export const schemaFields = {
  [veteranFields.parentObject]: veteranFields,
  [providerFacilityFields.parentObject]: providerFacilityFields,
  [patientIdentificationFields.parentObject]: patientIdentificationFields,
  [preparerIdentificationFields.parentObject]: preparerIdentificationFields,
  acknowledgeToReleaseInformation: 'acknowledgeToReleaseInformation',
  limitedConsent: 'limitedConsent',
  privacyAgreementAccepted: 'privacyAgreementAccepted',
};

export const veteranIsSelfText = 'I am the Veteran';
export const alternateSigner =
  'Alternate signer (a person certified to file claim forms for the Veteran or non-Veteran) ';

export const veteranDirectRelative = ['Spouse', 'Child'];

export const relationshipToVeteranEnum = [
  veteranIsSelfText,
  ...veteranDirectRelative,
  'Fiduciary',
  'Veteran Service Officer',
  alternateSigner,
  'Third-party',
];

export const relationshipToVeteranLabels = Object.freeze({
  veteran: veteranIsSelfText,
  spouse: 'Spouse',
  child: 'Child',
  fiduciary: 'Fiduciary',
  veteranServiceOfficer: 'Veteran Service Officer',
  alternateSigner,
  thirdParty: 'Third Party',
});
