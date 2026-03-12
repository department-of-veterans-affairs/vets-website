export const validateClaimantSsnNotMatchVeteranSsn = (
  errors,
  claimantSsn,
  formData,
) => {
  const veteranSsn = formData?.veteranIdentification?.ssn;
  if (!claimantSsn || !veteranSsn) {
    return;
  }

  const normalizedClaimantSsn = claimantSsn.replace(/\D/g, '');
  const normalizedVeteranSsn = veteranSsn.replace(/\D/g, '');

  if (normalizedClaimantSsn === normalizedVeteranSsn) {
    errors.addError(
      "Your Social Security number must be different from the Veteran's Social Security number.",
    );
  }
};
