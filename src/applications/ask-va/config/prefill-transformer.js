export default function prefillTransformer(pages, formData, metadata) {
  const prefillPersonalInformation = data => {
    const personalInfo = data?.personalInformation || {};
    const veteranInfo = data?.veteranServiceInformation || {};

    const {
      serviceNumber,
      socialSecurityNumber,
      ...restPersonalInfo
    } = personalInfo;

    return {
      aboutYourself: {
        ...restPersonalInfo,
        socialOrServiceNum: {
          serviceNumber: serviceNumber || '',
          ssn: socialSecurityNumber || '',
        },
        ...veteranInfo,
      },
    };
  };

  const prefillContactInformation = data => {
    const contactInfo = data?.contactInformation || {};
    const avaProfile = data?.avaProfile || {};

    const { phone, email, ...restContactInfo } = contactInfo;

    return {
      ...restContactInfo,
      ...avaProfile,
      phoneNumber: phone || '',
      emailAddress: email || '',
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
