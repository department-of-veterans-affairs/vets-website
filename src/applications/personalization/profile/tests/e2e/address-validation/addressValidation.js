export const createAddressValidationResponse = type => {
  if (type === 'low-confidence') {
    return {
      addresses: [
        {
          address: {
            addressLine1: '36320 Coronado Dr',
            addressType: 'DOMESTIC',
            city: 'Fremont',
            countryName: 'United States',
            countryCodeIso3: 'USA',
            countyCode: '06001',
            countyName: 'Alameda',
            stateCode: 'CA',
            zipCode: '94536',
            zipCodeSuffix: '5537',
          },
          addressMetaData: {
            confidenceScore: 88,
            addressType: 'Domestic',
            deliveryPointValidation: 'CONFIRMED',
            residentialDeliveryIndicator: 'RESIDENTIAL',
          },
        },
      ],
      validationKey: 80251930,
    };
  }

  if (type === 'military') {
    return {
      addresses: [
        {
          address: {
            addressLine1: 'PSC 808 Box 37',
            addressType: 'OVERSEAS MILITARY',
            city: 'FPO',
            countryName: 'United States',
            countryCodeIso3: 'USA',
            countyCode: '36061',
            countyName: 'New York County',
            stateCode: 'AE',
            zipCode: '09618',
            zipCodeSuffix: '0001',
          },
          addressMetaData: {
            confidenceScore: 100,
            addressType: 'Overseas Military',
            deliveryPointValidation: 'CONFIRMED',
            residentialDeliveryIndicator: 'BUSINESS',
          },
        },
      ],
      validationKey: -884397865,
    };
  }

  if (type === 'international') {
    return {
      addresses: [
        {
          address: {
            addressLine1: 'Dam 1',
            addressType: 'INTERNATIONAL',
            city: 'Amsterdam',
            countryName: 'Netherlands',
            countryCodeIso3: 'NLD',
            internationalPostalCode: '1012 JS',
            province: 'Noord-Holland',
          },
          addressMetaData: {
            confidenceScore: 100,
            addressType: 'International',
          },
        },
      ],
      validationKey: 873828139,
    };
  }

  if (type === 'bad-unit') {
    return {
      addresses: [
        {
          address: {
            addressLine1: '225 Irving St',
            addressLine2: 'Unit A',
            addressType: 'DOMESTIC',
            city: 'San Francisco',
            countryName: 'United States',
            countryCodeIso3: 'USA',
            countyCode: '06075',
            countyName: 'San Francisco',
            stateCode: 'CA',
            zipCode: '94122',
            zipCodeSuffix: '2652',
          },
          addressMetaData: {
            confidenceScore: 95,
            addressType: 'Domestic',
            deliveryPointValidation:
              'STREET_NUMBER_VALIDATED_BUT_BAD_UNIT_NUMBER',
            residentialDeliveryIndicator: 'RESIDENTIAL',
          },
        },
      ],
      validationKey: 66006473,
    };
  }

  if (type === 'missing-unit') {
    return {
      addresses: [
        {
          address: {
            addressLine1: '225 Irving St',
            addressType: 'DOMESTIC',
            city: 'San Francisco',
            countryName: 'United States',
            countryCodeIso3: 'USA',
            countyCode: '06075',
            countyName: 'San Francisco',
            stateCode: 'CA',
            zipCode: '94122',
            zipCodeSuffix: '2652',
          },
          addressMetaData: {
            confidenceScore: 98,
            addressType: 'Domestic',
            deliveryPointValidation:
              'STREET_NUMBER_VALIDATED_BUT_MISSING_UNIT_NUMBER',
            residentialDeliveryIndicator: 'RESIDENTIAL',
          },
        },
      ],
      validationKey: -1868391762,
    };
  }

  if (type === 'valid-address' || type === 'no-change') {
    return {
      addresses: [
        {
          address: {
            addressLine1: '36320 Coronado Dr',
            addressType: 'DOMESTIC',
            city: 'Fremont',
            countryName: 'United States',
            countryCodeIso3: 'USA',
            countyCode: '06001',
            countyName: 'Alameda',
            stateCode: 'MD',
            zipCode: '94536',
            zipCodeSuffix: '5537',
          },
          addressMetaData: {
            confidenceScore: 100,
            addressType: 'Domestic',
            deliveryPointValidation: 'CONFIRMED',
            residentialDeliveryIndicator: 'RESIDENTIAL',
          },
        },
      ],
      validationKey: -938645178,
    };
  }

  if (type === 'confirm-address') {
    return {
      addresses: [
        {
          address: {
            addressLine1: '36310 Coronado Dr',
            addressType: 'DOMESTIC',
            city: 'Fremont',
            countryName: 'United States',
            countryCodeIso3: 'USA',
            countyCode: '06001',
            countyName: 'Alameda',
            stateCode: 'CA',
            zipCode: '94536',
            zipCodeSuffix: '5537',
          },
          addressMetaData: {
            confidenceScore: 100,
            addressType: 'Domestic',
            deliveryPointValidation: 'UNDELIVERABLE',
          },
        },
      ],
      validationKey: 1952767315,
    };
  }

  if (type === 'one-suggestion') {
    return {
      addresses: [
        {
          address: {
            addressLine1: '400 N 65th St',
            addressType: 'DOMESTIC',
            city: 'Seattle',
            countryName: 'United States',
            countryCodeIso3: 'USA',
            countyCode: '53033',
            countyName: 'King',
            stateCode: 'WA',
            zipCode: '98103',
            zipCodeSuffix: '5252',
          },
          addressMetaData: {
            confidenceScore: 100,
            addressType: 'Domestic',
            deliveryPointValidation: 'UNDELIVERABLE',
          },
        },
        {
          address: {
            addressLine1: '400 NW 65th St',
            addressType: 'DOMESTIC',
            city: 'Seattle',
            countryName: 'United States',
            countryCodeIso3: 'USA',
            countyCode: '53033',
            countyName: 'King',
            stateCode: 'WA',
            zipCode: '98117',
            zipCodeSuffix: '5026',
          },
          addressMetaData: {
            confidenceScore: 100,
            addressType: 'Domestic',
            deliveryPointValidation: 'CONFIRMED',
            residentialDeliveryIndicator: 'RESIDENTIAL',
          },
        },
        {
          address: {
            addressLine1: '400 NE 65th St',
            addressType: 'DOMESTIC',
            city: 'Seattle',
            countryName: 'United States',
            countryCodeIso3: 'USA',
            countyCode: '53033',
            countyName: 'King',
            stateCode: 'WA',
            zipCode: '98115',
            zipCodeSuffix: '6463',
          },
          addressMetaData: {
            confidenceScore: 98,
            addressType: 'Domestic',
            deliveryPointValidation:
              'STREET_NUMBER_VALIDATED_BUT_MISSING_UNIT_NUMBER',
            residentialDeliveryIndicator: 'RESIDENTIAL',
          },
        },
      ],
      validationKey: -29210804,
    };
  }

  if (type === 'two-suggestions') {
    return {
      addresses: [
        {
          address: {
            addressLine1: '575 20th St',
            addressType: 'DOMESTIC',
            city: 'San Francisco',
            countryName: 'United States',
            countryCodeIso3: 'USA',
            countyCode: '06075',
            countyName: 'San Francisco',
            stateCode: 'CA',
            zipCode: '94107',
            zipCodeSuffix: '4345',
          },
          addressMetaData: {
            confidenceScore: 100,
            addressType: 'Domestic',
            deliveryPointValidation: 'CONFIRMED',
            residentialDeliveryIndicator: 'BUSINESS',
          },
        },
        {
          address: {
            addressLine1: '575 20th Ave',
            addressType: 'DOMESTIC',
            city: 'San Francisco',
            countryName: 'United States',
            countryCodeIso3: 'USA',
            countyCode: '06075',
            countyName: 'San Francisco',
            stateCode: 'CA',
            zipCode: '94121',
            zipCodeSuffix: '3122',
          },
          addressMetaData: {
            confidenceScore: 100,
            addressType: 'Domestic',
            deliveryPointValidation: 'CONFIRMED',
            residentialDeliveryIndicator: 'RESIDENTIAL',
          },
        },
      ],
      validationKey: 1786974931,
    };
  }
  return {};
};
