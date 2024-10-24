export const minPrefillData = {
  veteranFullName: {
    first: 'Greg',
    middle: 'A',
    last: 'Anderson',
  },
  veteranSocialSecurityNumber: '796121200',
};

export const minTransformedPrefillData = {
  edipi: '123456789',
  icn: '111222333',
  veteranFullName: {
    first: 'Greg',
    middle: 'A',
    last: 'Anderson',
  },
  veteranSocialSecurityNumber: '796121200',
  'view:otherContactInfo': {
    email: undefined,
    homePhone: undefined,
    mobilePhone: undefined,
  },
  'view:remainingEntitlement': {
    totalDays: 0,
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
  veteranAddress: {
    street: 'MILITARY ADDY 3',
    street2: 'ADDRESS LINE 2',
    city: 'DPO',
    country: 'USA',
    state: 'MI',
    postalCode: '22312',
  },
  schoolName: 'PURDUE UNIVERSITY-MAIN CAMPUS',
  schoolCity: 'WEST LAFAYETTE',
  schoolState: 'IN',
  schoolCountry: 'USA',
  remainingEntitlement: {
    months: 6,
    days: 4,
  },
};

export const transformedMaxPrefillData = {
  edipi: '123456789',
  icn: '111222333',
  veteranFullName: {
    first: 'Greg',
    middle: 'A',
    last: 'Anderson',
  },
  veteranSocialSecurityNumber: '796121200',
  'view:otherContactInfo': {
    email: 'test@email.com',
    homePhone: '5551234567',
    mobilePhone: '5551112222',
  },
  veteranAddress: {
    street: 'MILITARY ADDY 3',
    street2: 'ADDRESS LINE 2',
    city: 'DPO',
    country: 'USA',
    state: 'MI',
    postalCode: '22312',
  },
  schoolName: 'PURDUE UNIVERSITY-MAIN CAMPUS',
  schoolCity: 'WEST LAFAYETTE',
  schoolState: 'IN',
  schoolCountry: 'USA',
  'view:remainingEntitlement': {
    days: 4,
    months: 6,
    totalDays: 184,
  },
};

export const stateData = {
  user: {
    profile: {
      edipi: '123456789',
      icn: '111222333',
    },
  },
};
