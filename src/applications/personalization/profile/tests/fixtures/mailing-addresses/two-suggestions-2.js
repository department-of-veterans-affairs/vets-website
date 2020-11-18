export const twoSuggestions = {
  firstResponse: {
    data: [
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
  },
  secondResponse: {
    data: [
      {
        address: {
          addressLine1: '575 19th Ave',
          addressType: 'DOMESTIC',
          city: 'San Francisco',
          countryName: 'United States',
          countryCodeIso3: 'USA',
          countyCode: '06075',
          countyName: 'San Francisco',
          stateCode: 'CA',
          zipCode: '94121',
          zipCodeSuffix: '3118',
        },
        addressMetaData: {
          confidenceScore: 100,
          addressType: 'Domestic',
          deliveryPointValidation: 'CONFIRMED',
          residentialDeliveryIndicator: 'RESIDENTIAL',
        },
      },
    ],
    validationKey: -775260132,
  },
};
