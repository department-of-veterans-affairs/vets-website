const transactionId = '06880455-a2e2-4379-95ba-90aa53fdb273';

const transactions = {
  received: {
    data: {
      id: '',
      type: 'async_transaction_va_profile_telephone_transactions',
      attributes: {
        transactionId,
        transactionStatus: 'RECEIVED',
        type: 'AsyncTransaction::VAProfile::TelephoneTransaction',
        metadata: [],
      },
    },
  },
  receivedNoChangesDetected: {
    data: {
      id: '',
      type: 'async_transaction_va_profile_telephone_transactions',
      attributes: {
        transactionId,
        transactionStatus: 'COMPLETED_NO_CHANGES_DETECTED',
        type: 'AsyncTransaction::VAProfile::TelephoneTransaction',
        metadata: [],
      },
    },
  },
  successful: {
    data: {
      id: '',
      type: 'async_transaction_va_profile_telephone_transactions',
      attributes: {
        transactionId,
        transactionStatus: 'COMPLETED_SUCCESS',
        type: 'AsyncTransaction::VAProfile::TelephoneTransaction',
        metadata: [],
      },
    },
  },
};

const errors = {
  vets360Phon106: {
    errors: [
      {
        title: 'Null Phone Pattern',
        detail: 'Phone number pattern must match must match "[^a-zA-Z]+"',
        code: 'VET360_PHON106',
        source: 'VAProfile::ContactInformation::Service',
        status: '400',
      },
    ],
  },
};

module.exports = {
  transactions,
  errors,
};
