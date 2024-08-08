const prefillTransformer = (pages, formData, metadata, state) => {
  const { veteran = {} } = formData;
  const { fullName, ssn, vaFileNumber, address = {} } = veteran;
  const { profile } = state.user;
  const {
    loa,
    ssn: profileSsn,
    userFullName: profileFullName,
    vaFileNumber: profileVaFileNumber,
    zip: profileZip,
  } = profile;

  return {
    pages,
    formData: {
      ...formData,
      veteran: {
        address: {
          postalCode: address.postalCode || profileZip,
        },
        fullName: fullName || profileFullName,
        idNumber: {
          ssn: ssn || profileSsn,
          vaFileNumber: vaFileNumber || profileVaFileNumber,
        },
        loa: loa.current,
      },
    },
    metadata,
    state,
  };
};

export default prefillTransformer;
