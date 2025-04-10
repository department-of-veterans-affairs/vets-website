export const addressValidationResponse = {
  messages: [
    {
      code: 'string',
      key: 'string',
      text: 'string',
      severity: 'INFO',
      potentiallySelfCorrectingOnRetry: true,
    },
  ],
  address: {
    addressLine1: '590 Peter Jefferson Pkwy',
    addressLine2: '2nd Floor',
    addressLine3: 'Suite 250',
    cityName: 'Charlottesville',
    zipCode5: '22911',
    zipCode4: '1111',
    intPostalCode: 'N0A0C0',
    state: {
      stateName: 'Virginia',
      stateCode: 'VA',
    },
    province: {
      provinceName: 'Ontario',
      provinceCode: 'ON',
    },
    country: {
      countryName: 'United States',
      countryCodeFIPS: 'US',
      countryCodeISO2: 'US',
      countryCodeISO3: 'USA',
    },
    addressPOU: 'RESIDENCE',
    county: {
      countyName: 'Albemarle Count',
      countyCode: '51003',
    },
    geocode: {
      calcDate: '2025-04-07T20:01:27.225Z',
      locationPrecision: 10,
      latitude: 38.0293,
      longitude: -78.4767,
    },
    deliveryPointValidation: 'CONFIRMED',
    addressType: 'Domestic',
    confidence: 90,
  },
  overrideValidationKey: 0,
};
