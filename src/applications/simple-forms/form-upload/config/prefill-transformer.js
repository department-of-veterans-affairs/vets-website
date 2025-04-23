const prefillTransformer = (pages, formData, metadata, state) => {
  const { veteran = {} } = formData;
  const {
    fullName,
    ssn,
    vaFileNumber,
    address = {},
    phoneNumber,
    email,
  } = veteran;
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
      address: {
        postalCode: address.postalCode || profileZip,
      },
      fullName: fullName
        ? {
            first: fullName.first,
            last: fullName.last,
          }
        : {
            first: profileFullName.first,
            last: profileFullName.last,
          },
      phoneNumber: phoneNumber || profile.phoneNumber,
      email: email || profile.email,
      idNumber: {
        ssn: ssn || profileSsn,
        vaFileNumber: vaFileNumber || profileVaFileNumber,
      },
      loa: loa.current,
    },
    metadata,
    state,
  };
};

export default prefillTransformer;
