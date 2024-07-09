// checks
export const canUploadEvidence = formData =>
  formData.boardReviewOption === 'evidence_submission';
export const needsHearingType = formData =>
  formData.boardReviewOption === 'hearing';
export const wantsToUploadEvidence = formData =>
  canUploadEvidence(formData) && formData['view:additionalEvidence'];

export const showExtensionReason = formData => formData.requestingExtension;
