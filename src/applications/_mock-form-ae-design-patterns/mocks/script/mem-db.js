// create an in memory db to store the data for the mock server responses
const { hasIn } = require('lodash');
const user = require('../endpoints/user');

const memDb = {
  user: user.loa3User72,
};

const potentialAddressUpdateKeys = [
  'addressLine1',
  'addressLine2',
  'addressLine3',
  'city',
  'stateCode',
  'zipCode',
];

const profileHomePhoneUpdateKeys = [
  'areaCode',
  'countryCode',
  'extension',
  'phoneNumber',
];

const createAddressUpdateToUser = address => {
  for (const key of potentialAddressUpdateKeys) {
    if (hasIn(address, key)) {
      memDb.user.data.attributes.vet360ContactInformation.mailingAddress[key] =
        address[key];
    }
  }

  memDb.user.data.attributes.vet360ContactInformation.mailingAddress.updatedAt = new Date().toISOString();
};

const createHomePhoneUpdateToUser = mobilePhone => {
  for (const key of profileHomePhoneUpdateKeys) {
    if (hasIn(mobilePhone, key)) {
      memDb.user.data.attributes.vet360ContactInformation.homePhone[key] =
        mobilePhone[key];
    }
  }

  memDb.user.data.attributes.vet360ContactInformation.homePhone.updatedAt = new Date().toISOString();
};

const updateMemDb = (req, resJson) => {
  const key = `${req.method} ${req.url}`;

  const body = req?.body || {};

  if (key.includes('GET /v0/user')) {
    return memDb.user;
  }

  if (
    key === 'PUT /v0/profile/addresses' &&
    resJson.data.attributes.transactionId ===
      'mock-update-mailing-address-success-transaction-id'
  ) {
    createAddressUpdateToUser(body);
  }

  if (
    key === 'PUT /v0/profile/telephones' &&
    resJson.data.attributes.transactionId ===
      'mock-update-home-phone-success-transaction-id'
  ) {
    createHomePhoneUpdateToUser(body);
  }

  return resJson;
};

module.exports = {
  memDb,
  updateMemDb,
};
