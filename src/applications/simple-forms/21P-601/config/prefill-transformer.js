export default function prefillTransformer(pages, formData, metadata, state) {
  const profile = state?.user?.profile || {};

  // Build the prefilled data following the same pattern as 21P-0537
  return {
    pages,
    formData: {
      ...formData,
      claimantIdentification: {
        ssn: formData.claimantSsn || '',
        vaFileNumber: '',
      },
      claimantDateOfBirth: profile.dob || '',
    },
    metadata,
  };
}
