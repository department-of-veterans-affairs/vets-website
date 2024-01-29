/**
 * Gets the appropriate form key needed in the signature box so we can
 * corroborate who is signing the form.
 *
 * @param {object} formData All data currently in the form
 * @returns
 */
export default function getNameKeyForSignature(formData) {
  let nameKey;
  if (formData.certifierRole === 'sponsor') {
    nameKey = 'veteransFullName';
  } else if (formData.certifierRole === 'applicant') {
    nameKey = 'applicants[0].applicantName';
  } else {
    nameKey = 'certifierName';
  }

  return nameKey;
}
