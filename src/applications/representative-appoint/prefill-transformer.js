export function prefillTransformer(pages, formData, metadata) {
  const {
    veteranFullName,
    veteranSsnLastFour,
    veteranVaFileNumberLastFour,
    homePhone,
    mobilePhone,
    email,
    address,
    dateOfBirth,
  } = formData;

  const newFormData = {
    'view:applicantInformation': {
      veteranFullName,
      veteranSsnLastFour,
      dateOfBirth,
      veteranVaFileNumberLastFour,
    },
    'view:contactInformation': {
      'view:phoneAndEmail': {
        mobilePhone,
        alternatePhone: homePhone,
        email,
      },
      address,
    },
  };

  return {
    metadata,
    formData: newFormData,
    pages,
  };
}
