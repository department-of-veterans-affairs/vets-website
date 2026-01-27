export const getThirdPartyName = formData => {
  if (formData?.discloseInformation?.authorize === 'organization') {
    return formData?.thirdPartyOrganizationInformation?.organizationName;
  }
  if (formData?.discloseInformation?.authorize === 'person') {
    const name = formData?.thirdPartyPersonName?.fullName;
    return `${name.first} ${name.last}`;
  }
  return 'the third party';
};
