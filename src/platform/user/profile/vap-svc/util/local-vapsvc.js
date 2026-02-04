import { uniqueId } from 'lodash';
import * as VAP_SERVICE from '../constants';

export function isVAProfileServiceConfigured() {
  return (
    // using the existence of VetsGov.pollTimeout as an indicator that we are
    // running unit tests and therefore _do_ want the FE to make real API calls
    window.VetsGov.pollTimeout ||
    window.Cypress ||
    [
      'dev.va.gov',
      'preview.va.gov',
      'staging.va.gov',
      'va.gov',
      'www.va.gov',
    ].includes(document.location.hostname)
  );
}

export const mockContactInformation = {
  email: {
    id: 100,
    emailAddress: 'veteran@gmail.com',
  },
  mobilePhone: {
    areaCode: '503',
    countryCode: '1',
    createdAt: '2018-04-21T20:09:50Z',
    effectiveEndDate: '2018-04-21T20:09:50Z',
    effectiveStartDate: '2018-04-21T20:09:50Z',
    extension: '0000',
    id: 123,
    isInternational: false,
    isTextable: true,
    isTextPermitted: null,
    isTty: true,
    isVoicemailable: true,
    phoneNumber: '5551234',
    phoneType: 'MOBILE',
    sourceDate: '2018-04-21T20:09:50Z',
    updatedAt: '2018-04-21T20:09:50Z',
  },
  homePhone: {
    areaCode: '503',
    countryCode: '1',
    createdAt: '2018-04-21T20:09:50Z',
    effectiveEndDate: '2018-04-21T20:09:50Z',
    effectiveStartDate: '2018-04-21T20:09:50Z',
    extension: '0000',
    id: 123,
    isInternational: false,
    isTextable: false,
    isTextPermitted: false,
    isTty: true,
    isVoicemailable: true,
    phoneNumber: '2222222',
    phoneType: 'HOME',
    sourceDate: '2018-04-21T20:09:50Z',
    updatedAt: '2018-04-21T20:09:50Z',
  },
  workPhone: null,
  faxNumber: null,
  temporaryPhone: {
    areaCode: '503',
    countryCode: '1',
    createdAt: '2018-04-21T20:09:50Z',
    effectiveEndDate: '2018-04-21T20:09:50Z',
    effectiveStartDate: '2018-04-21T20:09:50Z',
    extension: '0000',
    id: 123,
    isInternational: false,
    isTextable: false,
    isTextPermitted: false,
    isTty: true,
    isVoicemailable: true,
    phoneNumber: '5555555',
    phoneType: 'MOBILE',
    sourceDate: '2018-04-21T20:09:50Z',
    updatedAt: '2018-04-21T20:09:50Z',
  },
  mailingAddress: {
    addressLine1: '1493 Martin Luther King Rd',
    addressLine2: 'Apt 1',
    addressLine3: null,
    addressPou: 'CORRESPONDENCE',
    addressType: 'DOMESTIC',
    city: 'Fulton',
    countryName: 'United States',
    countryCodeFips: 'US',
    countryCodeIso2: 'US',
    countryCodeIso3: 'USA',
    createdAt: '2018-04-21T20:09:50Z',
    effectiveEndDate: '2018-04-21T20:09:50Z',
    effectiveStartDate: '2018-04-21T20:09:50Z',
    id: 123,
    internationalPostalCode: '54321',
    province: 'string',
    sourceDate: '2018-04-21T20:09:50Z',
    stateCode: 'NY',
    updatedAt: '2018-04-21T20:09:50Z',
    zipCode: '97062',
    zipCodeSuffix: '1234',
    badAddress: false,
  },
  residentialAddress: {
    addressLine1: 'PSC 808 Box 37',
    addressLine2: null,
    addressLine3: null,
    addressPou: 'RESIDENCE',
    addressType: 'OVERSEAS MILITARY',
    city: 'FPO',
    countryName: 'United States',
    countryCodeFips: 'US',
    countryCodeIso2: 'US',
    countryCodeIso3: 'USA',
    latitude: 37.5615,
    longitude: -121.9988,
    createdAt: '2018-04-21T20:09:50Z',
    effectiveEndDate: '2018-04-21T20:09:50Z',
    effectiveStartDate: '2018-04-21T20:09:50Z',
    id: 124,
    internationalPostalCode: '54321',
    province: 'string',
    sourceDate: '2018-04-21T20:09:50Z',
    stateCode: 'AE',
    updatedAt: '2018-04-21T20:09:50Z',
    zipCode: '09618',
    zipCodeSuffix: '1234',
  },
};

export const makeMockContactInfo = () => {
  return { ...mockContactInformation };
};

function asyncReturn(returnValue, delay = 300) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(returnValue);
    }, delay);
  });
}

function asyncReject(returnValue, delay = 300) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(returnValue);
    }, delay);
  });
}

export default {
  getUserTransactions() {
    const data = [
      VAP_SERVICE.TRANSACTION_CATEGORY_TYPES.ADDRESS,
      VAP_SERVICE.TRANSACTION_CATEGORY_TYPES.EMAIL,
      VAP_SERVICE.TRANSACTION_CATEGORY_TYPES.PHONE,
    ]
      .filter(() => Math.random() > 0.5)
      .map(transactionType => ({
        attributes: {
          transactionId: uniqueId('transaction_'),
          transactionStatus: VAP_SERVICE.TRANSACTION_STATUS.RECEIVED,
          type: transactionType,
        },
      }));

    return {
      data,
    };
  },
  createTransaction() {
    return asyncReturn({
      data: {
        attributes: {
          transactionId: uniqueId('transaction_'),
          transactionStatus: VAP_SERVICE.TRANSACTION_STATUS.RECEIVED,
        },
      },
    });
  },
  createTransactionFailure() {
    return asyncReject(
      {
        errors: [
          {
            title: 'Service unavailable',
            detail: 'Backend Service Outage',
            code: '503',
            status: '503',
          },
        ],
      },
      1000,
    );
  },
  updateTransactionRandom(...args) {
    return asyncReturn(
      Math.random() > 0.5
        ? this.updateTransaction(...args)
        : this.updateTransactionToFailure(...args),
      3000,
    );
  },
  updateTransaction(transactionId) {
    return asyncReturn({
      data: {
        attributes: {
          transactionId,
          transactionStatus: VAP_SERVICE.TRANSACTION_STATUS.COMPLETED_SUCCESS,
        },
      },
    });
  },
  updateTransactionToFailure(transactionId, code = 'VET360_CORE100') {
    return {
      data: {
        attributes: {
          transactionStatus: VAP_SERVICE.TRANSACTION_STATUS.REJECTED,
          transactionId,
          type: 'AsyncTransaction::Vet360::MockedTransaction',
          metadata: [
            {
              code,
              key: '_CUF_NOT_FOUND',
              severity: 'ERROR',
              text: 'The tx for id/criteria XZY could not be found.',
            },
          ],
        },
      },
    };
  },
  addressValidationSuccessSingleConfirmedSuggestion() {
    return asyncReturn(
      {
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
              confidenceScore: 100.0,
              addressType: 'Domestic',
              deliveryPointValidation: 'CONFIRMED',
            },
          },
        ],
        validationKey: -245128725,
      },
      1000,
    );
  },
  addressValidationSuccessSingleInternational() {
    return asyncReturn(
      {
        addresses: [
          {
            address: {
              addressLine1: 'Great Russell Street',
              addressType: 'INTERNATIONAL',
              city: 'London',
              countryName: 'United Kingdom',
              countryCodeIso3: 'GBR',
              internationalPostalCode: 'WC1B 3DG',
            },
            addressMetaData: {
              confidenceScore: 96.0,
              addressType: 'International',
            },
          },
        ],
        validationKey: 1520831034,
      },
      1000,
    );
  },
  addressValidationSuccessTwoInternational() {
    return asyncReturn(
      {
        addresses: [
          {
            address: {
              addressLine1: '123 Great Russell Street',
              addressType: 'INTERNATIONAL',
              city: 'London',
              countryName: 'United Kingdom',
              countryCodeIso3: 'GBR',
              internationalPostalCode: 'WC1B 3DG',
            },
            addressMetaData: {
              confidenceScore: 96.0,
              addressType: 'International',
            },
          },
          {
            address: {
              addressLine1: '456 Great Russell Street',
              addressType: 'INTERNATIONAL',
              city: 'London',
              countryName: 'United Kingdom',
              countryCodeIso3: 'GBR',
              internationalPostalCode: 'WC1B 3DG',
            },
            addressMetaData: {
              confidenceScore: 96.0,
              addressType: 'International',
            },
          },
        ],
        validationKey: 1520831034,
      },
      1000,
    );
  },
  addressValidationSuccessTwoConfirmedSuggestions() {
    return asyncReturn(
      {
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
              confidenceScore: 100.0,
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
              confidenceScore: 100.0,
              addressType: 'Domestic',
              deliveryPointValidation: 'CONFIRMED',
              residentialDeliveryIndicator: 'RESIDENTIAL',
            },
          },
        ],
        validationKey: -773295895,
      },
      1000,
    );
  },
  addressValidationSuccessSingleLowConfidenceSuggestion() {
    return asyncReturn(
      {
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
              confidenceScore: 87.0,
              addressType: 'Domestic',
              deliveryPointValidation: 'CONFIRMED',
            },
          },
        ],
        validationKey: -245128725,
      },
      1000,
    );
  },
  addressValidationSuccessSingleMissingUnitNumber() {
    return asyncReturn(
      {
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
              confidenceScore: 100.0,
              addressType: 'Domestic',
              deliveryPointValidation:
                'STREET_NUMBER_VALIDATED_BUT_MISSING_UNIT_NUMBER',
            },
          },
        ],
        validationKey: -245128725,
      },
      1000,
    );
  },
  addressValidationSuccessSingleBadUnitNumber() {
    return asyncReturn(
      {
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
              confidenceScore: 100.0,
              addressType: 'Domestic',
              deliveryPointValidation:
                'STREET_NUMBER_VALIDATED_BUT_BAD_UNIT_NUMBER',
            },
          },
        ],
        validationKey: -245128725,
      },
      1000,
    );
  },
  // This is the response we are now getting when we enter total garbage data and the address can't be found. It seems to replace the ADDRVAL112 error response that we used to get for "bad" addresses
  addressValidationSuccessSingleBadAddress() {
    return asyncReturn(
      {
        addresses: [
          {
            address: {
              addressLine1: '123 McGee',
              addressType: 'UNKNOWN',
              city: 'San Francisco',
              countryName: 'United States',
              countryCodeIso3: 'USA',
              stateCode: 'CA',
              zipCode: '94122',
            },
            addressMetaData: {
              confidenceScore: 0.0,
              addressType: 'Unknown',
              deliveryPointValidation: 'MISSING_ZIP',
            },
          },
        ],
        validationKey: -245128725,
      },
      1000,
    );
  },
  addressValidationSuccessSingleBadAddressNoValidationKey() {
    return asyncReturn(
      {
        addresses: [
          {
            address: {
              addressLine1: '123 McGee',
              addressType: 'UNKNOWN',
              city: 'San Francisco',
              countryName: 'United States',
              countryCodeIso3: 'USA',
              stateCode: 'CA',
              zipCode: '94122',
            },
            addressMetaData: {
              confidenceScore: 0.0,
              addressType: 'Unknown',
              deliveryPointValidation: 'MISSING_ZIP',
            },
          },
        ],
      },
      1000,
    );
  },
  addressValidationError() {
    return asyncReject(
      {
        errors: [
          {
            title: 'Address Validation Error',
            detail: {
              messages: [
                {
                  code: 'ADDRVAL108',
                  key: 'CandidateAddressNotFound',
                  severity: 'INFO',
                  text: 'No Candidate Address Found',
                },
              ],
            },
            code: 'VET360_AV_ERROR',
            status: '400',
          },
        ],
      },
      1000,
    );
  },

  addressValidationSuccess() {
    return asyncReturn(
      {
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
              confidenceScore: 100.0,
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
              confidenceScore: 100.0,
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
              confidenceScore: 98.0,
              addressType: 'Domestic',
              deliveryPointValidation:
                'STREET_NUMBER_VALIDATED_BUT_MISSING_UNIT_NUMBER',
              residentialDeliveryIndicator: 'RESIDENTIAL',
            },
          },
        ],
        validationKey: -2009470897,
      },
      1000,
    );
  },
};
