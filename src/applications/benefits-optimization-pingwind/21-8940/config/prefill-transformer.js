/* eslint-disable no-console */
export default function prefillTransformer(pages, formData, metadata, state) {
  const profile = state?.user?.profile || {};
  const vaProfile = profile?.vaProfile || {};

  // formData = {
  //   "veteranFullName": {
  //     "first": "James",
  //     "middle": "M",
  //     "last": "Beck"
  //   },
  //   "veteranSocialSecurityNumber": "111111111",
  //   "veteranAddress": {
  //     "street": "1700 Clairmont Rd",
  //     "city": "Decatur",
  //     "state": "GA",
  //     "country": "USA",
  //     "postalCode": "30033"
  //   },
  //   "veteranPhone": "2023336688",
  //   "email": "vets.gov.user80@gmail.com"
  // }
  console.log(formData);

  const fullName = {};
  if (profile.userFullName) {
    fullName.first = profile.userFullName.first || '';
    fullName.middle = profile.userFullName.middle || '';
    fullName.last = profile.userFullName.last || '';
    fullName.suffix = profile.userFullName.suffix || '';
  }

  const veteranDateOfBirth =
    profile.dob || profile.birthDate || vaProfile.birthDate || '';

  const veteranPhone =
    profile.vapContactInfo.homePhone ||
    profile.vapContactInfo.mobilePhone ||
    profile.vapContactInfo.workPhone ||
    '';

  const emailAddress = profile.email || '';

  // profile.vapContactInfo.residentialAddress
  // profile.vapContactInfo.mailingAddress
  return {
    pages,
    formData: {
      veteran: {
        fullName,
      },
      veteranDateOfBirth,
      veteranPhone,
      emailAddress,
    },
    metadata,
  };
}
