export const ADDRESS_REGEX = {
  county: () => {
    const disallowList = [
      'US',
      'U.S',
      'U.S.',
      'USA',
      'U.SA',
      'U.S.A',
      'U.S.A.',
      'United States',
      'UnitedStates',
      'United States of America',
      'UnitedStatesOfAmerica',
    ];
    return `^(?!(${disallowList.join('|')})$)`;
  },
};

export const ALLOWED_FILE_TYPES = ['pdf', 'jpg', 'jpeg', 'png'];

export const API_ENDPOINTS = {
  facilities: '/caregivers_assistance_claims/facilities',
};

export const MAX_FILE_SIZE_MB = 10;

export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const REQUIRED_ADDRESS_FIELDS = [
  'street',
  'city',
  'state',
  'postalCode',
  'county',
];
