export default function prefillTransformer(pages, formData, metadata) {
  // Prefill claimant information from veteran data
  const transformedData = {
    ...formData,
  };

  // If we have veteran data, use it to prefill claimant fields
  if (formData?.veteran) {
    transformedData.claimantFullName = formData.veteran.fullName || {};
    transformedData.claimantSsn = formData.veteran.ssn || '';
    transformedData.claimantDateOfBirth = formData.veteran.dateOfBirth || '';
    transformedData.claimantAddress = formData.veteran.address || {};
    transformedData.claimantPhone =
      formData.veteran.homePhone || formData.veteran.mobilePhone || '';
    transformedData.claimantEmail = formData.veteran.email || '';

    // Also prefill veteran fields for the deceased veteran section
    // User can modify if the veteran is different from the claimant
    transformedData.veteranFullName = formData.veteran.fullName || {};
    transformedData.veteranSsn = formData.veteran.ssn || '';
  }

  return {
    pages,
    formData: transformedData,
    metadata,
  };
}
