/* eslint-disable no-console */
export default function prefillTransformer(pages, formData, metadata, state) {
  const profile = state?.user?.profile || {};
  const vaProfile = profile?.vaProfile || {};

  let fullName = {};
  if (formData?.veteranFullName) {
    fullName = formData.veteranFullName;
  } else {
    fullName.first = profile?.userFullName?.first || '';
    fullName.middle = profile?.userFullName?.middle || '';
    fullName.last = profile?.userFullName?.last || '';
    fullName.suffix = profile?.userFullName?.suffix || '';
  }

  const dateOfBirth =
    formData.veteranDateOfBirth ||
    profile.dob ||
    profile.birthDate ||
    vaProfile.birthDate ||
    '';

  const ssn = formData.veteranSocialSecurityNumber || '';

  const phoneNum =
    formData?.veteranPhone ||
    profile?.vapContactInfo?.mobilePhone ||
    profile?.vapContactInfo?.workPhone ||
    '';
  const homePhone = {
    callingCode: '',
    contact: phoneNum,
    countryCode: '',
  };

  const email =
    formData.email ||
    formData.emailAddress ||
    profile?.email ||
    profile?.vapContactInfo?.email ||
    '';

  let address = {};
  if (formData?.veteranAddress) {
    address = formData.veteranAddress;
  } else {
    address.street =
      profile?.vapContactInfo?.mailingAddress?.addressLine1 || '';
    address.street2 =
      profile?.vapContactInfo?.mailingAddress?.addressLine2 || '';
    address.street3 =
      profile?.vapContactInfo?.mailingAddress?.addressLine3 || '';
    address.city = profile?.vapContactInfo?.mailingAddress?.city || '';
    address.state = profile?.vapContactInfo?.mailingAddress?.stateCode || '';
    address.country =
      profile?.vapContactInfo?.mailingAddress?.countryCodeIso3 || '';
    address.postalCode = profile?.vapContactInfo?.mailingAddress?.zipCode || '';
    // profile.vapContactInfo.residentialAddress
  }

  return {
    pages,
    formData: {
      veteran: {
        fullName,
        dateOfBirth,
        address,
        email,
        homePhone,
        ssn,
      },
    },
    metadata,
  };
}
