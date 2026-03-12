export const validateSpouseSsnNotMatchVeteranSsn = (
  errors,
  spouseSsn,
  formData,
) => {
  const veteranSsn = formData?.veteranIdentification?.ssn;
  if (!spouseSsn || !veteranSsn) {
    return;
  }

  const normalizedSpouseSsn = spouseSsn.replace(/\D/g, '');
  const normalizedVeteranSsn = veteranSsn.replace(/\D/g, '');

  if (normalizedSpouseSsn === normalizedVeteranSsn) {
    errors.addError(
      "Spouse's Social Security number must be different from the deceased Veteran's Social Security number.",
    );
  }
};
