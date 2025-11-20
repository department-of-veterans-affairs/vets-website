export function prefillTransformer(pages, formData, metadata) {
  const { homePhone, mobilePhone, email } = formData;

  return {
    metadata,
    formData: {
      ...formData,
      // Initialize nested objects with empty arrays for array builders
      veteran: {
        ...formData.veteran,
        otherMarriages: formData.veteran?.otherMarriages || [],
      },
      spouse: {
        ...formData.spouse,
        otherMarriages: formData.spouse?.otherMarriages || [],
      },
      living: {
        ...formData.living,
        periods: formData.living?.periods || [],
      },
      veteranContactInformation: {
        phoneNumber: homePhone || mobilePhone || '',
        emailAddress: email || '',
      },
    },
    pages,
  };
}

export default prefillTransformer;
