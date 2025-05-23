export const dob = '2001-10-28';
export const userFullName = {
  first: 'Mike',
  middle: '',
  last: 'Wazowski',
  suffix: '',
};

export const veteran = (US = true, phone = 'phone') => ({
  vaFileLastFour: '8765',
  address: {
    addressType: US ? 'DOMESTIC' : 'INTERNATIONAL',
    addressLine1: '123 Main St',
    addressLine2: 'Suite #1200',
    addressLine3: 'Box 4567890',
    city: US ? 'New York' : 'Paris',
    countryName: US ? 'United States' : 'France',
    countryCodeIso2: US ? 'US' : 'FR',
    stateCode: US ? 'NY' : null,
    province: US ? null : 'Ile-de-France',
    zipCode: US ? '30012' : null,
    internationalPostalCode: US ? null : '75000',
  },
  [phone]: {
    countryCode: '6',
    areaCode: '555',
    phoneNumber: '8001111',
    extension: '2345',
  },
  homePhone: {
    countryCode: '7',
    areaCode: '555',
    phoneNumber: '8002222',
    extension: '5678',
  },
  email: 'user@example.com',
});
