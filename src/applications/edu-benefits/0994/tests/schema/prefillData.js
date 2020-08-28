export const maxPrefillData = {
  mailingAddress: {
    street: 'MILITARY ADDY 3',
    city: 'DPO',
    country: 'USA',
    state: 'MI',
    postalCode: '22312',
  },
  bankAccount: {
    bankAccountType: 'Checking',
    bankAccountNumber: '*********1234',
    bankRoutingNumber: '*****2115',
    bankName: 'Comerica',
  },
  applicantFullName: {
    first: 'Greg',
    middle: 'A',
    last: 'Anderson',
  },
  applicantGender: 'M',
  dateOfBirth: '1933-04-05',
  applicantSocialSecurityNumber: '796121200',
  dayTimePhone: '4445551212',
  nightTimePhone: '4445551212',
  emailAddress: 'test2@test1.net',
};

export const transformedMaxPrefillData = {
  mailingAddress: {
    street: 'MILITARY ADDY 3',
    city: 'DPO',
    country: 'USA',
    state: 'MI',
    postalCode: '22312',
  },
  prefillBankAccount: {
    bankAccountType: 'Checking',
    bankAccountNumber: '*********1234',
    bankRoutingNumber: '*****2115',
    bankName: 'Comerica',
  },
  applicantFullName: {
    first: 'Greg',
    middle: 'A',
    last: 'Anderson',
  },
  applicantGender: 'M',
  dateOfBirth: '1933-04-05',
  applicantSocialSecurityNumber: '796121200',
  dayTimePhone: '4445551212',
  nightTimePhone: '4445551212',
  emailAddress: 'test2@test1.net',
  'view:phoneAndEmail': {
    dayTimePhone: '4445551212',
    nightTimePhone: '4445551212',
    emailAddress: 'test2@test1.net',
  },
  'view:bankAccount': {
    'view:hasBankInformation': true,
  },
};

export const minPrefillData = {
  applicantFullName: {
    first: 'Greg',
    middle: 'A',
    last: 'Anderson',
  },
  applicantGender: 'M',
  dateOfBirth: '1933-04-05',
  applicantSocialSecurityNumber: '796121200',
};

export const minTransformedPrefillData = {
  applicantFullName: {
    first: 'Greg',
    middle: 'A',
    last: 'Anderson',
  },
  applicantGender: 'M',
  dateOfBirth: '1933-04-05',
  applicantSocialSecurityNumber: '796121200',
  'view:phoneAndEmail': {
    dayTimePhone: undefined,
    nightTimePhone: undefined,
    emailAddress: undefined,
  },
  prefillBankAccount: undefined,
  'view:bankAccount': {
    'view:hasBankInformation': false,
  },
};
