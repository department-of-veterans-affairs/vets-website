export function prefillTransformer(pages, formData, metadata, state) {
  const { mailingAddress } = state.user.profile?.vapContactInfo;
  const { emailAddress } = state.user.profile?.vapContactInfo?.email;
  const {
    areaCode,
    phoneNumber,
  } = state.user.profile?.vapContactInfo?.mobilePhone;

  let newData = formData;

  if (mailingAddress) {
    newData = { ...newData, mailingAddress };
  }

  if (areaCode && phoneNumber) {
    newData = {
      ...newData,
      contactInfo: {
        ...newData.contactInfo,
        phoneNumber: areaCode + phoneNumber,
      },
    };
  }

  if (emailAddress) {
    newData = {
      ...newData,
      contactInfo: {
        ...newData.contactInfo,
        primaryEmail: emailAddress,
        confirmationEmail: emailAddress,
      },
    };
  }

  return {
    metadata,
    formData: newData,
    pages,
  };
}
