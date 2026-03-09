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

export const veteranNew = () => ({
  ...veteran(),
  email: {
    createdAt: '2024-01-22T13:30:04.000-06:00',
    confirmationDate: '2024-01-30T14:02:39.000-06:00',
    emailAddress: 'vets.gov.user80@gmail.com',
    effectiveEndDate: null,
    effectiveStartDate: '2024-01-30T14:02:33.000-06:00',
    id: 284099,
    sourceDate: '2024-01-30T14:02:39.000-06:00',
    sourceSystemUser: null,
    transactionId: '1661becc-2de4-4003-a6a1-74d21e6291eb',
    updatedAt: '2024-01-30T14:02:41.000-06:00',
    verificationDate: null,
    vet360Id: '1133854',
    vaProfileId: '1133854',
  },
});
