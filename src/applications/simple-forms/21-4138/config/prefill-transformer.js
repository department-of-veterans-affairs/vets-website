export default function prefillTransformer(pages, formData, metadata, state) {
  const profile = state?.user?.profile || {};
  const isUserVeteran = profile?.veteranStatus?.isVeteran === true;
  const userFullName = profile.userFullName || {};
  const dateOfBirth = profile.dob || '';

  return {
    pages,
    formData: {
      ...formData,
      'view:userIsVeteran': isUserVeteran,
      fullName: isUserVeteran
        ? {
            first: userFullName.first || formData?.fullName?.first,
            middle: userFullName.middle || formData?.fullName?.middle,
            last: userFullName.last || formData?.fullName?.last,
          }
        : formData?.fullName,
      dateOfBirth: isUserVeteran
        ? dateOfBirth || formData?.dateOfBirth
        : formData?.dateOfBirth,
    },
    metadata,
  };
}

