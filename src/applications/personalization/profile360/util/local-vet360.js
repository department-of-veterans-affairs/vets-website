import { uniqueId } from 'lodash';
import * as VET360_CONSTANTS from '../constants/vet360';

export function isVet360Configured() {
  return document.location.hostname !== 'localhost';
}

export const mockContactInformation = {
  email: {
    id: 100,
    emailAddress: 'asdf@asdf.com'
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
    isTty: true,
    isVoicemailable: true,
    phoneNumber: '5551234',
    phoneType: 'MOBILE',
    sourceDate: '2018-04-21T20:09:50Z',
    updatedAt: '2018-04-21T20:09:50Z'
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
    isTextable: true,
    isTty: true,
    isVoicemailable: true,
    phoneNumber: '2222222',
    phoneType: 'HOME',
    sourceDate: '2018-04-21T20:09:50Z',
    updatedAt: '2018-04-21T20:09:50Z'
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
    isTextable: true,
    isTty: true,
    isVoicemailable: true,
    phoneNumber: '5555555',
    phoneType: 'MOBILE',
    sourceDate: '2018-04-21T20:09:50Z',
    updatedAt: '2018-04-21T20:09:50Z'
  },
  mailingAddress: {
    addressLine1: '1493 Martin Luther King Rd',
    addressLine2: 'string',
    addressLine3: 'string',
    addressPou: 'CORRESPONDENCE',
    addressType: 'domestic',
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
    zipCodeSuffix: '1234'
  },
};


function asyncReturn(returnValue) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(returnValue);
    }, 300);
  });
}

export default {
  getUserTransactions() {
    const data = [
      VET360_CONSTANTS.TRANSACTION_CATEGORY_TYPES.ADDRESS,
      VET360_CONSTANTS.TRANSACTION_CATEGORY_TYPES.EMAIL,
      VET360_CONSTANTS.TRANSACTION_CATEGORY_TYPES.PHONE
    ].filter(() => {
      return Math.random() > 0.5;
    }).map(transactionType => {
      return {
        attributes: {
          transactionId: uniqueId('transaction_'),
          transactionStatus: VET360_CONSTANTS.TRANSACTION_STATUS.RECEIVED,
          type: transactionType
        }
      };
    });

    // console.log(data);

    return {
      data
    };
  },
  createTransaction() {
    return asyncReturn({
      data: {
        attributes: {
          transactionId: uniqueId('transaction_'),
          transactionStatus: VET360_CONSTANTS.TRANSACTION_STATUS.RECEIVED
        }
      }
    });
  },
  updateTransactionRandom(...args) {
    if (Math.random() > 0.5) {
      return this.updateTransaction(...args);
    }
    return this.updateTransactionToFailure(...args);
  },
  updateTransaction(transactionId) {
    return {
      data: {
        attributes: {
          transactionId,
          transactionStatus: VET360_CONSTANTS.TRANSACTION_STATUS.COMPLETED_SUCCESS
        }
      }
    };
  },
  updateTransactionToFailure(transactionId, code = 'VET360_CORE100') {
    return {
      data: {
        attributes: {
          transactionStatus: VET360_CONSTANTS.TRANSACTION_STATUS.REJECTED,
          transactionId,
          type: 'AsyncTransaction::Vet360::MockedTransaction',
          metadata: [
            {
              code,
              key: '_CUF_NOT_FOUND',
              severity: 'ERROR',
              text: 'The tx for id/criteria XZY could not be found.'
            }
          ]
        }
      }
    };
  }
};
