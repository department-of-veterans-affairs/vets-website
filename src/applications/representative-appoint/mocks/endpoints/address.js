const mailingAddressUpdateReceived = {
  request: {
    route: 'v0/profile/addresses',
    method: 'PUT',
    payload: {
      id: 311999,
      addressLine1: '123 Mailing Address St.',
      addressLine2: 'Apt 1',
      addressType: 'DOMESTIC',
      city: 'Fulton',
      countryCodeIso3: 'USA',
      stateCode: 'NY',
      zipCode: '97064',
      addressPou: 'CORRESPONDENCE',
      validationKey: 1564180368,
    },
  },
  response: {
    data: {
      id: '',
      type: 'async_transaction_va_profile_address_transactions',
      attributes: {
        transactionId: 'c591aef1-59e4-41ad-9c28-ee8b6fc3e678',
        transactionStatus: 'RECEIVED',
        type: 'AsyncTransaction::VAProfile::AddressTransaction',
        metadata: [],
      },
    },
  },
};

const mailingAddressStatusSuccess = {
  data: {
    id: '',
    type: 'async_transaction_va_profile_address_transactions',
    attributes: {
      transactionId: 'c591aef1-59e4-41ad-9c28-ee8b6fc3e678',
      transactionStatus: 'COMPLETED_SUCCESS',
      type: 'AsyncTransaction::VAProfile::AddressTransaction',
      metadata: [],
    },
  },
};

const mailingAddressUpdateNoChangeDetected = {
  data: {
    id: '',
    type: 'async_transaction_va_profile_address_transactions',
    attributes: {
      transactionId: 'f00afa69-691f-4155-aac0-34c93d3fb504',
      transactionStatus: 'COMPLETED_NO_CHANGES_DETECTED',
      type: 'AsyncTransaction::VAProfile::AddressTransaction',
      metadata: [],
    },
  },
};

const homeAddressUpdateReceived = {
  data: {
    id: '',
    type: 'async_transaction_va_profile_address_transactions',
    attributes: {
      transactionId: '94725087-d546-47e1-a247-f57ab0ed599c',
      transactionStatus: 'RECEIVED',
      type: 'AsyncTransaction::VAProfile::AddressTransaction',
      metadata: [],
    },
  },
};

const homeAddressDeleteReceived = {
  data: {
    id: '',
    type: 'async_transaction_va_profile_address_transactions',
    attributes: {
      transactionId: 'mock-delete-home-address-transaction-id',
      transactionStatus: 'RECEIVED',
      type: 'AsyncTransaction::VAProfile::AddressTransaction',
      metadata: [],
    },
  },
};

const homeAddressUpdateSuccess = {
  data: {
    id: '',
    type: 'async_transaction_va_profile_address_transactions',
    attributes: {
      transactionId: '94725087-d546-47e1-a247-f57ab0ed599c',
      transactionStatus: 'COMPLETED_SUCCESS',
      type: 'AsyncTransaction::VAProfile::AddressTransaction',
      metadata: [],
    },
  },
};

const addressValidation = {
  addresses: [
    {
      address: {
        addressLine1: '345 Home Address St',
        addressType: 'DOMESTIC',
        city: 'San Francisco',
        countryName: 'United States',
        countryCodeIso3: 'USA',
        stateCode: 'CA',
        zipCode: '94115',
      },
      addressMetaData: {
        confidenceScore: 0,
        addressType: 'Domestic',
        deliveryPointValidation: 'MISSING_ZIP',
      },
    },
  ],
  validationKey: -981994727,
};

module.exports = {
  mailingAddressUpdateReceived,
  mailingAddressUpdateNoChangeDetected,
  mailingAddressStatusSuccess,
  homeAddressUpdateReceived,
  homeAddressUpdateSuccess,
  homeAddressDeleteReceived,
  addressValidation,
};
