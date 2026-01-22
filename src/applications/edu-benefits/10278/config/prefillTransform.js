export default function prefillTransformer(pages, formData, metadata, state) {
  const isLoggedIn = state?.user?.login?.currentlyLoggedIn || false;
  const profile = state?.user?.profile || {};
  const userFullName = profile?.userFullName || {};
  const dob = profile?.dob || '';

  const transformedFormData = {
    ...formData,
    userLoggedIn: isLoggedIn,
  };

  if (isLoggedIn && (userFullName.first || userFullName.last || dob)) {
    transformedFormData.claimantPersonalInformation = {
      fullName: {
        first: userFullName.first || '',
        middle: userFullName.middle || '',
        last: userFullName.last || '',
      },
      dateOfBirth: dob || '',
    };
  }

  return {
    metadata,
    formData: transformedFormData,
    pages,
  };
}
