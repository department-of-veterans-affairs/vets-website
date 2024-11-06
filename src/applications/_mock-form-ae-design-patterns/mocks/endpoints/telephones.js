const homePhoneUpdateReceivedPrefillTaskPurple = {
  data: {
    id: '',
    type: 'async_transaction_va_profile_telephone_transactions',
    attributes: {
      transactionId: 'mock-update-home-phone-success-transaction-id',
      transactionStatus: 'RECEIVED',
      type: 'AsyncTransaction::VAProfile::TelephoneTransaction',
      metadata: [],
    },
  },
};

const mobilePhoneUpdateReceivedPrefillTaskBlue = {
  data: {
    id: '',
    type: 'async_transaction_va_profile_telephone_transactions',
    attributes: {
      transactionId: 'mock-update-mobile-phone-success-transaction-id',
      transactionStatus: 'RECEIVED',
      type: 'AsyncTransaction::VAProfile::TelephoneTransaction',
      metadata: [],
    },
  },
};

module.exports = {
  homePhoneUpdateReceivedPrefillTaskPurple,
  mobilePhoneUpdateReceivedPrefillTaskBlue,
};
