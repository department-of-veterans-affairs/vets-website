const prefillTransformer = (pages, formData, metadata, state) => {
  const { veteran = {} } = formData;
  const {
    veteranFullName,
    veteranSsn,
    address = {},
    email,
    veteranDateOfBirth,
  } = veteran;
  const { profile } = state.user;
  const {
    loa,
    ssn: profileSsn,
    userFullName: profileFullName,
    zip: profileZip,
  } = profile;

  return {
    pages,
    formData: {
      address: {
        postalCode: address.postalCode || profileZip,
      },
      dateOfBirth: veteranDateOfBirth,
      veteranFullName: veteranFullName
        ? {
            first: veteranFullName.first,
            last: veteranFullName.last,
          }
        : {
            first: profileFullName.first,
            last: profileFullName.last,
          },
      email: email || profile.email,
      idNumber: {
        ssn: veteranSsn || profileSsn,
      },
      loa: loa.current,
    },
    metadata,
    state,
  };
};

export default prefillTransformer;
