module.exports = {
  base: {
    data: [
      {
        id: '',
        type: 'async_transaction_va_profile_address_transactions',
        attributes: {
          transactionId: '89747e43-d01b-4024-81fb-5e0361f9cf9f',
          transactionStatus: 'COMPLETED_NO_CHANGES_DETECTED',
          type: 'AsyncTransaction::VAProfile::AddressTransaction',
          metadata: [],
        },
      },
    ],
  },
  failure: {
    data: {
      id: '',
      type: 'async_transaction_va_profile_address_transactions',
      attributes: {
        transactionId: '1b187b89-00d4-49c8-8acc-20746fbdfca6',
        transactionStatus: 'COMPLETED_FAILURE',
        type: 'AsyncTransaction::VAProfile::AddressTransaction',
        metadata: [
          {
            code: 'ADDRVAL112',
            key: 'addressBio.AddressCouldNotBeFound',
            retryable: null,
            severity: 'ERROR',
            text: 'The Address could not be found',
          },
          {
            code: 'ADDR306',
            key: 'addressBio.lowConfidenceScore',
            retryable: null,
            severity: 'ERROR',
            text: 'VaProfile Validation Failed: Confidence Score less than 80',
          },
          {
            code: 'ADDR305',
            key: 'addressBio.deliveryPointNotConfirmed',
            retryable: null,
            severity: 'ERROR',
            text:
              'VaProfile Validation Failed: Delivery Point is Not Confirmed for Domestic Residence',
          },
        ],
      },
    },
  },
  '89747e43-d01b-4024-81fb-5e0361f9cf9f': {
    data: [
      {
        id: '',
        type: 'async_transaction_va_profile_telephone_transactions',
        attributes: {
          transactionId: '89747e43-d01b-4024-81fb-5e0361f9cf9f',
          transactionStatus: 'COMPLETED_SUCCESS',
          type: 'AsyncTransaction::VAProfile::TelephoneTransaction',
          metadata: [],
        },
      },
    ],
  },
  success: {
    data: {
      id: '',
      type: 'async_transaction_va_profile_address_transactions',
      attributes: {
        transactionId: 'success-test-id',
        transactionStatus: 'COMPLETED_SUCCESS',
        type: 'AsyncTransaction::VAProfile::AddressTransaction',
        metadata: [],
      },
    },
  },
};
