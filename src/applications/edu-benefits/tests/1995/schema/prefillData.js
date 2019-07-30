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
  veteranAddress: {
    street: 'MILITARY ADDY 3',
    city: 'DPO',
    country: 'USA',
    state: 'MI',
    postalCode: '22312',
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
  },
  veteranAddress: {
    street: 'MILITARY ADDY 3',
    city: 'DPO',
    country: 'USA',
    state: 'MI',
    postalCode: '22312',
  },
};
