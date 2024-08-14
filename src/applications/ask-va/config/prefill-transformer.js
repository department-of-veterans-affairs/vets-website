import _ from 'platform/utilities/data';

// Adding mock prefill data for research-testing
const mockPrefillData = {
  personalInformation: {
    first: 'Jason',
    last: 'Todd',
    suffix: 'Jr.',
    preferredName: 'Robin',
    socialSecurityNumber: '123456987',
    serviceNumber: '11111111',
    dateOfBirth: '1999-08-16',
  },
  contactInformation: {
    email: 'j.todd@redhood.com',
    phone: '4445551212',
    address: {
      street: '49119 Wayne Manor',
      city: 'Gotham',
      state: 'IL',
      country: 'USA',
      postalCode: '86360',
    },
  },
  avaProfile: {
    schoolInfo: { schoolFacilityCode: '12345678', schoolName: 'Fake School' },
    businessPhone: '1234567890',
    businessEmail: 'fake@company.com',
  },
  veteranServiceInformation: {
    branchOfService: 'Army',
    serviceDateRange: {
      from: '2012-03-02',
      to: '2018-10-31',
    },
  },
};

export default function prefillTransformer(pages, formData, metadata) {
  const prefillPersonalInformation = data => {
    const newData = _.omit(
      ['personalInformation', 'veteranServiceInformation'],
      data,
    );
    const { personalInformation, veteranServiceInformation } = data;

    if (personalInformation) {
      const {
        first,
        middle,
        last,
        suffix,
        preferredName,
        socialSecurityNumber,
        serviceNumber,
        dateOfBirth,
      } = personalInformation;

      const { branchOfService } = veteranServiceInformation;

      newData.aboutYourself = {};

      if (first) newData.aboutYourself.first = first;
      if (middle) newData.aboutYourself.middle = middle;
      if (last) newData.aboutYourself.last = last;
      if (suffix) newData.aboutYourself.suffix = suffix;
      if (preferredName) newData.preferredName = preferredName;
      if (dateOfBirth) newData.aboutYourself.dateOfBirth = dateOfBirth;
      if (branchOfService)
        newData.aboutYourself.branchOfService = branchOfService;
      if (serviceNumber)
        newData.aboutYourself.socialOrServiceNum = { serviceNumber };
      if (socialSecurityNumber)
        newData.aboutYourself.socialOrServiceNum = {
          ssn: socialSecurityNumber,
        };
    }

    return newData;
  };

  const prefillContactInformation = data => {
    const newData = _.omit(['contactInformation', 'avaProfile'], data);
    const { contactInformation, avaProfile } = data;

    if (contactInformation) {
      const {
        onBaseOutsideUS,
        country,
        address,
        phone,
        email,
      } = contactInformation;

      const { schoolInfo, businessEmail, businessPhone } = avaProfile;

      if (onBaseOutsideUS) newData.onBaseOutsideUS = onBaseOutsideUS;
      if (country) newData.country = country;
      if (email) newData.emailAddress = email;
      if (phone) newData.phoneNumber = phone;
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
    formData: transformations.reduce(applyTransformations, mockPrefillData),
    pages,
  };
}
