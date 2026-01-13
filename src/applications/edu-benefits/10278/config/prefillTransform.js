export default function prefillTransformer(pages, formData, metadata) {
  const { fullName, dateOfBirth, ssn } = formData;

  const newFormData = {
    ...formData,
    fullName,
    ssn,
    dateOfBirth,
  };

  return {
    metadata,
    formData: newFormData,
    pages,
  };
}
