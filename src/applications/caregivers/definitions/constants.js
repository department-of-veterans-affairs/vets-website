export const veteranFields = {
  address: 'veteranAddress',
  alternativePhoneNumber: 'veteranAlternativePhoneNumber',
  dateOfBirth: 'veteranDateOfBirth',
  email: 'veteranEmail',
  facilityType: 'veteranFacilityType',
  fullName: 'veteranFullName',
  gender: 'veteranGender',
  plannedClinic: 'plannedClinic',
  preferredFacilityInfoView: 'view:preferredFacilityInfo',
  preferredFacilityStateView: 'veteranFacilityState',
  preferredFacilityView: 'veteranPreferredFacility',
  previousTreatmentFacility: 'veteranLastTreatmentFacility',
  primaryPhoneNumber: 'veteranPrimaryPhoneNumber',
  ssn: 'veteranSsnOrTin',
  verifyEmail: 'view:veteranEmail',
};

export const primaryCaregiverFields = {
  address: 'primaryAddress',
  alternativePhoneNumber: 'primaryAlternativePhoneNumber',
  dateOfBirth: 'primaryDateOfBirth',
  email: 'primaryEmail',
  emailEncouragementMessage: 'view:emailEncouragementMessage',
  fullName: 'primaryFullName',
  gender: 'primaryGender',
  hasSecondaryCaregiverOne: 'view:hasSecondaryCaregiverOne',
  primaryPhoneNumber: 'primaryPrimaryPhoneNumber',
  ssn: 'primarySsnOrTin',
  verifyEmail: 'view:primaryEmail',
  vetRelationship: 'primaryVetRelationship',
  hasHealthInsurance: 'primaryHasHealthInsurance',
  hasPrimaryCaregiver: 'view:hasPrimaryCaregiver',
};

export const secondaryOneFields = {
  address: 'secondaryOneAddress',
  alternativePhoneNumber: 'secondaryOneAlternativePhoneNumber',
  dateOfBirth: 'secondaryOneDateOfBirth',
  email: 'secondaryOneEmail',
  emailEncouragementMessage: 'view:emailEncouragementMessage',
  fullName: 'secondaryOneFullName',
  gender: 'secondaryOneGender',
  hasSecondaryCaregiverTwo: 'view:hasSecondaryCaregiverTwo',
  primaryPhoneNumber: 'secondaryOnePrimaryPhoneNumber',
  ssn: 'secondaryOneSsnOrTin',
  verifyEmail: 'view:secondaryOneEmail',
  vetRelationship: 'secondaryOneVetRelationship',
};

export const secondaryTwoFields = {
  address: 'secondaryTwoAddress',
  alternativePhoneNumber: 'secondaryTwoAlternativePhoneNumber',
  dateOfBirth: 'secondaryTwoDateOfBirth',
  email: 'secondaryTwoEmail',
  emailEncouragementMessage: 'view:emailEncouragementMessage',
  fullName: 'secondaryTwoFullName',
  gender: 'secondaryTwoGender',
  primaryPhoneNumber: 'secondaryTwoPrimaryPhoneNumber',
  ssn: 'secondaryTwoSsnOrTin',
  verifyEmail: 'view:secondaryTwoEmail',
  vetRelationship: 'secondaryTwoVetRelationship',
};

export const representativeFields = {
  signAsRepresentativeYesNo: 'signAsRepresentativeYesNo',
  documentUpload: 'signAsRepresentativeDocumentUpload',
};

export const emptyObjectSchema = {
  type: 'object',
  properties: {},
};

export const ALLOWED_FILE_TYPES = ['pdf', 'jpg', 'jpeg', 'png'];
export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
