export const minPrefillData = {
  veteranFullName: {
    first: 'Greg',
    middle: 'A',
    last: 'Anderson',
  },
  veteranSocialSecurityNumber: '796121200',
};

export const minTransformedPrefillData = {
  'view:applicantInformation': {
    veteranFullName: {
      first: 'Greg',
      middle: 'A',
      last: 'Anderson',
    },
    veteranSocialSecurityNumber: '796121200',
    dateOfBirth: undefined,
  },
  'view:contactInformation': {
    address: undefined,
    'view:phoneAndEmail': {
      alternatePhone: undefined,
      email: undefined,
      mobilePhone: undefined,
    },
  },
};

export const maxPrefillData = {
  veteranFullName: {
    first: 'Greg',
    middle: 'A',
    last: 'Anderson',
  },
  veteranSocialSecurityNumber: '796121200',
  email: 'test@email.com',
  homePhone: '5551234567',
  mobilePhone: '5551112222',
  address: {
    street: 'MILITARY ADDY 3',
    street2: 'ADDRESS LINE 2',
    city: 'DPO',
    country: 'USA',
    state: 'MI',
    postalCode: '22312',
  },
  dateOfBirth: '1979-01-01',
  bankAccount: {
    accountNumber: '88888888888',
    accountType: 'checking',
    routingNumber: '123456789',
  },
};

export const transformedMaxPrefillData = {
  'view:applicantInformation': {
    veteranFullName: {
      first: 'Greg',
      middle: 'A',
      last: 'Anderson',
    },
    veteranSocialSecurityNumber: '796121200',
    dateOfBirth: '1979-01-01',
  },
  'view:contactInformation': {
    'view:phoneAndEmail': {
      email: 'test@email.com',
      alternatePhone: '5551234567',
      mobilePhone: '5551112222',
    },
    address: {
      street: 'MILITARY ADDY 3',
      street2: 'ADDRESS LINE 2',
      city: 'DPO',
      country: 'USA',
      state: 'MI',
      postalCode: '22312',
    },
  },
  'view:originalBankAccount': {
    'view:accountNumber': '88888888888',
    'view:accountType': 'checking',
    'view:routingNumber': '123456789',
    'view:bankName': undefined,
  },
  'view:directDeposit': {
    bankAccount: {
      accountNumber: '88888888888',
      accountType: 'checking',
      routingNumber: '123456789',
      'view:hasPrefilledBank': true,
    },
  },
};
