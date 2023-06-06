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

export const veteranDirectRelative = ['Spouse', 'Child'];

export const relationshipToVeteranEnum = [
  veteranIsSelfText,
  ...veteranDirectRelative,
  'Fiduciary',
  'Veteran Service Officer',
  'Alternate signer (a person certified to file a claim forms for the Veteran or non-Veteran) ',
  'Third-party',
];

export const workInProgressContent = {
  description:
    'We’re rolling out the Authorize the release of non-VA medical information to VA (VA Forms 21-4142 and 21-4142a) in stages. It’s not quite ready yet. Please check back again soon.',
  redirectLink: '/',
  redirectText: 'Return to VA home page',
};
