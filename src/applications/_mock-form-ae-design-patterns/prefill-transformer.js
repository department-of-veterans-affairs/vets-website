export default function prefillTransformer(pages, formData, metadata) {
  const fullName = {
    first: formData.data.attributes.veteran.firstName,
    middle: formData.data.attributes.veteran.middleName,
    last: formData.data.attributes.veteran.lastName,
  };

  const newFormData = { fullName };

  return {
    metadata,
    formData: newFormData,
    pages,
  };
}
