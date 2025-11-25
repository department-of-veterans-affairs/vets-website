const prefillTransformer = (pages, formData, metadata, state) => {
  const { profile, vet360ContactInformation } = state.user;
  const {
    userFullName: profileFullName,
    dob: profileDateOfBirth,
    gender: profileGender,
  } = profile;

  // Extract contact information
  const email = vet360ContactInformation?.email?.emailAddress || '';
  const homePhone = vet360ContactInformation?.homePhone
    ? `${vet360ContactInformation.homePhone.areaCode}${
        vet360ContactInformation.homePhone.phoneNumber
      }`
    : '';
  const mobilePhone = vet360ContactInformation?.mobilePhone
    ? `${vet360ContactInformation.mobilePhone.areaCode}${
        vet360ContactInformation.mobilePhone.phoneNumber
      }`
    : '';

  return {
    pages,
    formData: {
      veteranFullName: profileFullName
        ? {
            first: profileFullName.first,
            middle: profileFullName.middle,
            last: profileFullName.last,
          }
        : formData?.veteranFullName || {},
      gender: profileGender || formData?.gender || '',
      veteranDateOfBirth:
        profileDateOfBirth || formData?.veteranDateOfBirth || '',
      email: email || formData?.email || '',
      homePhone: homePhone || formData?.homePhone || '',
      mobilePhone: mobilePhone || formData?.mobilePhone || '',
      // Keep existing formData for fields not prefilled from profile
      ...formData,
    },
    metadata,
    state,
  };
};

export default prefillTransformer;
