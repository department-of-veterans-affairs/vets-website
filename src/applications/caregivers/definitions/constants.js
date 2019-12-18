// Define all the fields in the form to aid reuse
export const chapterOneFields = {
  address: 'veteranAddress',
  cellNumber: 'veteranCellNumber',
  email: 'veteranEmail',
  fullName: 'veteranFullName',
  gender: 'veteranGender',
  medicaidEnrolled: 'veteranMedicaidEnrolled',
  plannedClinic: 'veteranPlannedClinic',
  previousTreatmentFacility: 'veteranPreviousTreatmentFacility',
  ssn: 'ssn',
  telephoneNumber: 'veteranTelephoneNumber',
  vaEnrolled: 'veteranVaEnrolled',
  dateOfBirth: 'veteranDateOfBirth',
  facilityType: 'facilityType',
};

export const chapterTwoFields = {
  address: 'primaryCaregiverAddress',
  dateOfBirth: 'primaryCaregiverDateOfBirth',
  cellNumber: 'primaryCaregiverCellNumber',
  email: 'primaryCaregiverEmail',
  fullName: 'primaryCaregiverFullName',
  gender: 'primaryCaregiverGender',
  medicaidEnrolled: 'caregiverMedicaidEnrolled',
  otherHealthInsurance: 'OtherHealthInsurance',
  otherHealthInsuranceName: 'otherHealthInsuranceName',
  ssn: 'primaryCaregiverSsn',
  telephoneNumber: 'primaryCaregiverTelephoneNumber',
  vetRelationship: 'primaryCaregiverVetRelationship',
};

export const chapterThreeFields = {
  secondary: {
    address: 'secondaryCaregiverAddress',
    dateOfBirth: 'secondaryCaregiverDateOfBirth',
    cellNumber: 'secondaryCaregiverCellNumber',
    email: 'secondaryCaregiverEmail',
    fullName: 'secondaryCaregiverFullName',
    gender: 'secondaryCaregiverGender',
    ssn: 'secondaryCaregiverSsn',
    telephoneNumber: 'secondaryCaregiverTelephoneNumber',
    vaEnrolled: 'secondaryCaregiverVaEnrolled',
    vetRelationship: 'secondaryCaregiverVetRelationship',
  },
  tertiary: {
    address: 'tertiaryCaregiverAddress',
    dateOfBirth: 'tertiaryCaregiverDateOfBirth',
    cellNumber: 'tertiaryCaregiverCellNumber',
    email: 'tertiaryCaregiverEmail',
    fullName: 'tertiaryCaregiverFullName',
    gender: 'tertiaryCaregiverGender',
    ssn: 'tertiaryCaregiverSsn',
    telephoneNumber: 'tertiaryCaregiverTelephoneNumber',
    vaEnrolled: 'tertiaryCaregiverVaEnrolled',
    vetRelationship: 'tertiaryCaregiverVetRelationship',
  },
};
