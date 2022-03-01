const createMockSuccessResponse = _data => {
  return { data: 'Checkin successful', status: 200 };
};

const createMockFailedResponse = _data => {
  return { data: { error: true } };
};

const createMockEditSuccessResponse = _data => {
  return { data: 'Update successful', status: 200 };
};

const createMockEditErrorResponse = _data => {
  return { data: { error: true } };
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

const createMockAddressValidationErrorResponse = errorCode => {
  switch (errorCode) {
    case 400:
    case 404:
    case 500:
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
        },
        status: errorCode,
      };
    case 401:
      return {
        message: 'No API key found in request',
        status: errorCode,
      };
    case 403:
      return {
        message: 'You cannot consume this service',
        status: errorCode,
      };
    case 429:
      return {
        message: 'API rate limit exceeded',
        status: errorCode,
      };
    default:
      return {
        error: true,
        status: errorCode,
      };
  }
};

module.exports = {
  createMockSuccessResponse,
  createMockFailedResponse,
  createMockEditSuccessResponse,
  createMockEditErrorResponse,
  createMockAddressValidationSuccessResponse,
  createMockAddressValidationErrorResponse,
};
