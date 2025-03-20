export default function prefillTransformer(pages, formData, metadata) {
  const prefillPersonalInformation = data => {
    const personalInfo = data?.personalInformation || {};
    const veteranInfo = data?.veteranServiceInformation || {};

    return {
      aboutYourself: {
        ...personalInfo,
        socialOrServiceNum: {
          serviceNumber: personalInfo?.serviceNumber || '',
          ssn: personalInfo?.socialSecurityNumber || '',
        },
        ...veteranInfo,
      },
    };
  };

  const prefillContactInformation = data => {
    const contactInfo = data?.contactInformation || {};
    const avaProfile = data?.avaProfile || {};

    return {
      ...contactInfo,
      ...avaProfile,
      phoneNumber: contactInfo?.phone || '',
      emailAddress: contactInfo?.email || '',
    };
  };

  const prefillFormData = {
    ...prefillPersonalInformation(formData || {}),
    ...prefillContactInformation(formData || {}),
  };

  return {
    metadata,
    formData: prefillFormData,
    pages,
  };
}
