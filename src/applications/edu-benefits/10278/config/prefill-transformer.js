export default function prefillTransformer(pages, formData, metadata, state) {
  const { fullName, dateOfBirth } = formData;
  const { dob, userFullName } = state?.user?.profile || {};

  const newFormData = {
    ...formData,
    // Use prefilled data if available, otherwise use profile data
    fullName: fullName || userFullName,
    dateOfBirth: dateOfBirth || dob,
  };

  return {
    metadata,
    formData: newFormData,
    pages,
  };
}
