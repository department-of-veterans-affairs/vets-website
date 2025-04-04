export default function prefillTransformer(pages, formData, metadata) {
  const prefillPersonalInformation = data => {
    const personalInfo = data?.personalInformation || {};
    const veteranInfo = data?.veteranServiceInformation || {};

    const {
      serviceNumber,
      socialSecurityNumber,
      ...restPersonalInfo
    } = personalInfo;

    const socialOrServiceNum = {};
    if (serviceNumber) socialOrServiceNum.serviceNumber = serviceNumber;
    if (socialSecurityNumber) socialOrServiceNum.ssn = socialSecurityNumber;

    return {
      aboutYourself: {
        ...restPersonalInfo,
        ...(Object.keys(socialOrServiceNum).length > 0 && {
          socialOrServiceNum,
        }),
        ...veteranInfo,
      },
    };
  };

  const prefillContactInformation = data => {
    const contactInfo = data?.contactInformation || {};
    const avaProfile = data?.avaProfile || {};

    const { phone, email, workPhone, ...restContactInfo } = contactInfo;
    const { businessPhone } = avaProfile;

    return {
      ...restContactInfo,
      ...avaProfile,
      phoneNumber: phone || '',
      emailAddress: email || '',
      businessPhone: workPhone || businessPhone || '',
      businessEmail: email || '',
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
