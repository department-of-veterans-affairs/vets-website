export const minPrefillData = {
  veteranFullName: {
    first: 'Greg',
    middle: 'A',
    last: 'Anderson',
  },
  veteranSocialSecurityNumber: '796121200',
};

export const minTransformedPrefillData = {
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
  remainingEntitlement: {
    months: 6,
    days: 4,
  },
};

export const transformedMaxPrefillData = {
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
  'view:remainingEntitlement': {
    days: 4,
    months: 6,
    totalDays: 184,
  },
};
