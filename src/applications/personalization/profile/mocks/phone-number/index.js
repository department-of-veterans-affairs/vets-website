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

module.exports = {
  transactions,
};
