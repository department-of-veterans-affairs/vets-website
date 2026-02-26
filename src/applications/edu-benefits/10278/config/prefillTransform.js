export default function prefillTransformer(pages, formData, metadata, state) {
  const profile = state?.user?.profile || {};
  const userFullName = profile?.userFullName || {};
  const dob = profile?.dob || '';

  const transformedFormData = {
    ...formData,
    userLoggedIn: true,
    claimantPersonalInformation: {
      fullName: {
        first: userFullName.first,
        middle: userFullName.middle,
        last: userFullName.last,
      },
      dateOfBirth: dob,
      ssn: formData.ssn,
      vaFileNumber: formData.ssn,
    },
  };

  return {
    metadata,
    formData: transformedFormData,
    pages,
  };
}
