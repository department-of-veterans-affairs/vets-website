const prefillTransformer = (pages, formData, metadata, state) => {
  const { veteran } = formData || {};
  const { fullName, ssn, vaFileNumber, address } = veteran || {};
  const { profile } = state.user;
  const { userFullName, loa, zip } = profile;

  return {
    pages,
    formData: {
      ...formData,
      'view:veteranPrefillStore': {
        fullName: fullName || userFullName,
        loa: loa.current,
        ssn: ssn || profile?.ssn,
        vaFileNumber: vaFileNumber || profile?.vaFileNumber,
        zipCode: address?.postalCode || zip,
      },
    },
    metadata,
    state,
  };
};

export default prefillTransformer;
