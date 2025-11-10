const transactions = {
  received: {
    data: {
      id: '',
      type: 'async_transaction_va_profile_email_adress_transactions',
      attributes: {
        transactionId: 'email_address_tx_id',
        transactionStatus: 'RECEIVED',
        type: 'AsyncTransaction::VAProfile::EmailAddressTransaction',
        metadata: [],
      },
    },
  },
  successful: {
    data: {
      id: '',
      type: 'async_transaction_va_profile_email_adress_transactions',
      attributes: {
        transactionId: 'email_address_tx_id',
        transactionStatus: 'COMPLETED_SUCCESS',
        type: 'AsyncTransaction::VAProfile::EmailAddressTransaction',
        metadata: [],
      },
    },
  },
};

module.exports = { transactions };
