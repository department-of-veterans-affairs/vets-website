export const veteranFields = {
  parentObject: 'veteran',
  fullName: 'fullName',
  dateOfBirth: 'dateOfBirth',
  ssn: 'ssn',
  vaFileNumber: 'vaFileNumber',
  veteranServiceNumber: 'veteranServiceNumber',
  address: 'address',
  homePhone: 'homePhone',
  internationalPhone: 'internationalPhone',
  email: 'email',
};

export const providerFacilityFields = {
  parentObject: 'providerFacility',
  providerFacilityName: 'providerFacilityName',
  conditionsTreated: 'conditionsTreated',
  treatmentDateRange: 'treatmentDateRange',
  providerFacilityAddress: 'providerFacilityAddress',
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
  acknowledgeToReleaseInformation: 'acknowledgeToReleaseInformation',
  limitedConsent: 'limitedConsent',
  privacyAgreementAccepted: 'privacyAgreementAccepted',
};
