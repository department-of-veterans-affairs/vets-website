// signer section
export const isNotEnrolledInChampva = formData =>
  !formData.certifierReceivedPacket;

export const isRoleApplicant = formData =>
  formData.certifierRole === 'applicant';

export const isRoleSponsor = formData => formData.certifierRole === 'sponsor';

export const isRoleOther = formData => formData.certifierRole === 'other';

// claim status section
export const isResubmissionEnabled = formData =>
  formData['view:champvaEnableClaimResubmitQuestion'];

export const isNewClaim = formData =>
  !isResubmissionEnabled(formData) || formData.claimStatus === 'new';

export const isResubmissionClaim = formData =>
  formData.claimStatus === 'resubmission';

// beneficiary section
export const canSelectAddress = formData =>
  !isRoleApplicant(formData) &&
  !!(formData.certifierAddress?.street || formData.sponsorAddress?.street);

// claim type section
export const isMedicalClaim = formData => formData.claimType === 'medical';

export const isPharmacyClaim = formData => formData.claimType === 'pharmacy';

export const isNewMedicalClaim = formData =>
  isNewClaim(formData) && isMedicalClaim(formData);

export const isNewPharmacyClaim = formData =>
  isNewClaim(formData) && isPharmacyClaim(formData);

// insurance section
export const hasOhi = formData => isNewClaim(formData) && formData.hasOhi;

export const hasOhiAndMedicalClaim = formData =>
  hasOhi(formData) && isMedicalClaim(formData);

export const hasOhiMedicalAndMultiplePolicies = formData =>
  hasOhiAndMedicalClaim(formData) && (formData.policies || []).length > 1;
