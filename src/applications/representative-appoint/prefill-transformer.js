import _ from 'platform/utilities/data';

export function prefillTransformer(pages, formData, metadata) {
  const prefillPersonalInformation = data => {
    const newData = _.omit(['personalInformation'], data);
    const { personalInformation } = data;

    if (personalInformation) {
      const {
        first,
        middle,
        last,
        suffix,
        socialOrServiceNum,
        dateOfBirth,
        brandOfService,
      } = personalInformation;
      newData.aboutYourself = {};

      if (first) newData.aboutYourself.first = first;
      if (middle) newData.aboutYourself.middle = middle;
      if (last) newData.aboutYourself.last = last;
      if (suffix) newData.aboutYourself.suffix = suffix;
      if (dateOfBirth) newData.aboutYourself.dateOfBirth = dateOfBirth;
      if (brandOfService) newData.aboutYourself.brandOfService = brandOfService;

      if (socialOrServiceNum) {
        const { ssn, serviceNumber } = socialOrServiceNum;
        newData.aboutYourself.socialOrServiceNum = {};

        if (ssn) newData.aboutYourself.socialOrServiceNum.ssn = ssn;
        if (serviceNumber)
          newData.aboutYourself.socialOrServiceNum.serviceNumber = serviceNumber;
      }
    }

    return newData;
  };

  const prefillContactInformation = data => {
    const newData = _.omit(['contactInformation', 'avaProfile'], data);
    const { contactInformation, avaProfile } = data;

    if (contactInformation) {
      const {
        preferredName,
        onBaseOutsideUS,
        country,
        address,
        phoneNumber,
        emailAddress,
      } = contactInformation;
      const { schoolInfo, businessEmail, businessPhone } = avaProfile;

      if (preferredName) newData.contactPreferredName = preferredName;
      if (onBaseOutsideUS) newData.onBaseOutsideUS = onBaseOutsideUS;
      if (country) newData.country = country;
      if (emailAddress) newData.emailAddress = emailAddress;
      if (phoneNumber) newData.phoneNumber = phoneNumber;
      if (schoolInfo) newData.school = schoolInfo;
      if (businessEmail) newData.businessEmail = businessEmail;
      if (businessPhone) newData.businessPhone = businessPhone;

      if (address) {
        const { militaryAddress } = address;
        newData.address = {
          street: address.street || '',
          unitNumber: address.unitNumber || '',
          street2: address.street2 || '',
          street3: address.street3 || '',
          city: address.city || '',
          state: address.state || '',
          postalCode: address.postalCode || '',
        };

        if (militaryAddress) {
          newData.address.militaryAddress = {
            militaryPostOffice: militaryAddress.militaryPostOffice,
            militaryState: militaryAddress.militaryState,
          };
        }
      }
    }

    return newData;
  };

  const transformations = [
    prefillPersonalInformation,
    prefillContactInformation,
  ];

  const applyTransformations = (data = {}, transformer) => transformer(data);

  return {
    metadata,
    formData: transformations.reduce(applyTransformations, formData),
    pages,
  };
}
