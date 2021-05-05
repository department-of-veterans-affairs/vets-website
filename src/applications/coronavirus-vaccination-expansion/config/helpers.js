export const isTypeNone = formData => formData?.applicantType === 'none';

export const isVeteran = formData => formData?.applicantType === 'veteran';

export const isSpouseOrCaregiver = formData =>
  formData?.applicantType === 'spouse' ||
  formData?.applicantType === 'caregiverEnrolled' ||
  formData?.applicantType === 'caregiverOfVeteran';
