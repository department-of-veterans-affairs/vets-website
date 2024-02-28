export default function prefillTransformer(pages, formData, metadata) {
  return {
    pages,
    formData: {
      'view:veteranPrefillStore': {
        fullName: formData.veteran.fullName,
        dateOfBirth: formData.veteran.dateOfBirth,
        ssn: formData.veteran.ssn,
        address: formData.veteran.address,
        homePhone: formData.veteran.homePhone,
        mobilePhone: formData.veteran.mobilePhone,
        email: formData.veteran.email,
      },
    },
    metadata,
  };
}
