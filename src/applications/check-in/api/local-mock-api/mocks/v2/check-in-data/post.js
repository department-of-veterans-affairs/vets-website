const createMockSuccessResponse = _data => {
  return { data: 'Checkin successful', status: 200 };
};

const createMockAddressValidationSuccessResponse = _data => {
  return {
    data: {
      messages: [
        {
          code: 'string',
          key: 'string',
          text: 'string',
          severity: 'INFO',
          potentiallySelfCorrectingOnRetry: true,
        },
      ],
      candidateAddresses: [
        {
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
            addressLine1: 'string',
            addressLine2: 'string',
            addressLine3: 'string',
            city: 'string',
            zipCode5: 'string',
            zipCode4: 'string',
            internationalPostalCode: 'string',
            county: {
              name: 'string',
              countyFipsCode: 'string',
            },
            stateProvince: {
              name: 'string',
              code: 'string',
            },
            country: {
              name: 'string',
              code: 'string',
              fipsCode: 'string',
              iso2Code: 'string',
              iso3Code: 'string',
            },
          },
          geocode: {
            calcDate: '2022-03-01T00:23:20.040Z',
            locationPrecision: 0,
            latitude: 0,
            longitude: 0,
          },
          usCongressionalDistrict: 'string',
          addressMetaData: {
            confidenceScore: 0,
            addressType: 'string',
            deliveryPointValidation: 'CONFIRMED',
            residentialDeliveryIndicator: 'RESIDENTIAL',
            nonPostalInputData: ['string'],
            validationKey: 0,
          },
        },
      ],
    },
    status: 200,
  };
};

const createMockAddressValidationErrorResponse = _data => {
  return { data: { error: true } };
};

module.exports = {
  createMockSuccessResponse,
  createMockAddressValidationSuccessResponse,
  createMockAddressValidationErrorResponse,
};
