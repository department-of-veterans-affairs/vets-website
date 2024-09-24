// create an in memory db to store the data for the mock server responses
const _ = require('lodash');

const user = require('../endpoints/user');

// in memory db
const memDb = {
  user: user.loa3User72,
};

// sanitize user input
const sanitize = dirty => {
  // if input is a number, return it as is
  if (typeof dirty === 'number' && !Number.isNaN(dirty)) return dirty;
  if (typeof dirty !== 'string') {
    throw new Error('Cannot sanitize, input must be a string');
  }
  return _.escape(dirty.replace(/<[^>]*>/g, '')).trim();
};

const updateFields = (target, source, fields) => {
  return fields.reduce(
    (updatedTarget, field) => {
      if (_.has(source, field)) {
        return {
          ...updatedTarget,
          [field]: sanitize(source[field]),
        };
      }
      return updatedTarget;
    },
    { ...target, updatedAt: new Date().toISOString() },
  );
};

// the path in the user object to update and the fields to update in that path
const updateConfig = {
  mailingAddress: {
    path: 'data.attributes.vet360ContactInformation.mailingAddress',
    fields: [
      'addressLine1',
      'addressLine2',
      'addressLine3',
      'city',
      'stateCode',
      'zipCode',
    ],
  },
  homePhone: {
    path: 'data.attributes.vet360ContactInformation.homePhone',
    fields: ['areaCode', 'countryCode', 'extension', 'phoneNumber'],
  },
};

const createUpdate = type => data => {
  const config = updateConfig[type];
  const target = _.get(memDb.user, config.path);
  const updatedTarget = updateFields(target, data, config.fields);
  _.set(memDb.user, config.path, updatedTarget);
};

const createMailingAddressUpdate = createUpdate('mailingAddress');
const createHomePhoneUpdate = createUpdate('homePhone');

const updateMemDb = (req, resJson) => {
  const key = `${req.method} ${req.url}`;

  const body = req?.body || {};

  if (key.includes('GET /v0/user')) {
    return memDb.user;
  }

  const updates = {
    'PUT /v0/profile/addresses': {
      condition:
        resJson.data.attributes.transactionId ===
        'mock-update-mailing-address-success-transaction-id',
      action: () => createMailingAddressUpdate(body),
    },
    'PUT /v0/profile/telephones': {
      condition:
        resJson.data.attributes.transactionId ===
        'mock-update-home-phone-success-transaction-id',
      action: () => createHomePhoneUpdate(body),
    },
  };

  if (updates[key]?.condition) {
    updates[key].action();
  }

  return resJson;
};

module.exports = {
  memDb,
  updateMemDb,
};
