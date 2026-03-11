/**
 * Compose multiple form "depends" predicates into a single predicate that
 * returns `true` only when **all** predicates return `true`.
 *
 * This is useful for form config `depends` functions to keep conditions readable
 * and consistent:
 *
 * @example
 * const isNotDeceased = formData => !formData?.sponsorIsDeceased;
 * const noSharedAddress = formData => formData?.['view:sharesAddressWith'] === NOT_SHARED;
 *
 * const depends = whenAll(isNotDeceased, noSharedAddress);
 * // depends(formData) === true only if both predicates pass
 *
 * @param {...(formData: any) => boolean} preds
 *   Predicate functions that accept the current `formData` and return a boolean.
 * @returns {(formData: any) => boolean}
 *   A predicate function suitable for a page `depends` property.
 */
export const whenAll = (...preds) => formData => preds.every(p => p(formData));

// signer section
export const isNotEnrolledInChampva = formData =>
  !formData.certifierReceivedPacket;

export const isRoleApplicant = formData =>
  formData.certifierRole === 'applicant';

export const isRoleSponsor = formData => formData.certifierRole === 'sponsor';

export const isRoleOther = formData => formData.certifierRole === 'other';

// claim status section
export const isDtaEnabled = formData =>
  formData['view:champvaEnableClaimResubmitQuestion'];

export const isNewClaim = formData => formData.claimStatus === 'new';

export const isResubmissionClaim = formData =>
  formData.claimStatus === 'resubmission';

export const hasClaimDocs = formData => {
  if (!isResubmissionClaim(formData)) return false;
  return isDtaEnabled(formData) ? formData['view:hasClaimDocs'] : true;
};

export const needsDocHelp = whenAll(
  isDtaEnabled,
  isResubmissionClaim,
  formData => formData['view:hasClaimDocs'] === false,
);

// beneficiary section
export const canSelectAddress = formData =>
  !isRoleApplicant(formData) &&
  !!(formData.certifierAddress?.street || formData.sponsorAddress?.street);

// claim type section
export const isMedicalClaim = formData => formData.claimType === 'medical';

export const isPharmacyClaim = formData => formData.claimType === 'pharmacy';

export const isNewMedicalClaim = whenAll(isNewClaim, isMedicalClaim);

export const isNewPharmacyClaim = whenAll(isNewClaim, isPharmacyClaim);

// insurance section
export const hasOhi = whenAll(isNewClaim, formData => formData.hasOhi);

export const hasOhiAndMedicalClaim = whenAll(hasOhi, isMedicalClaim);

export const hasOhiMedicalAndMultiplePolicies = whenAll(
  hasOhiAndMedicalClaim,
  formData => (formData.policies || []).length > 1,
);
