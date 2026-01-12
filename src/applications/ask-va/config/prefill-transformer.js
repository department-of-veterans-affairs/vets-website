export default function prefillTransformer(pages, formData, metadata) {
  const prefillPersonalInformation = data => {
    const personalInfo = data?.personalInformation || {};
    const veteranInfo = data?.veteranServiceInformation || {};

    return {
      aboutYourself: {
        ...personalInfo,
        ...veteranInfo,
      },
    };
  };

  const prefillContactInformation = data => {
    const contactInfo = data?.contactInformation || {};
    const avaProfile = data?.avaProfile || {};

    const { phone, email, workPhone, ...restContactInfo } = contactInfo;
    const { businessPhone, businessEmail } = avaProfile;

    return {
      ...restContactInfo,
      ...avaProfile,
      phoneNumber: phone || '',
      emailAddress: email || '',
      businessPhone: workPhone || businessPhone || '',
      businessEmail: businessEmail || email || '',
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
