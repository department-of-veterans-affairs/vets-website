const _ = require('lodash');

const {
  loa3UserWithNoContactInfo,
  loa3User,
  loa3UserWithNoEmail,
} = require('../endpoints/user');

const possibleUsers = {
  loa3UserWithNoContactInfo,
  loa3User,
  loa3UserWithNoEmail,
};

// in memory db
const memDb = {
  user: possibleUsers.loa3User,
  inProgressForm: {
    formData: {},
    metadata: {},
  },
};

const updateInProgressForm = payload => {
  const metadata = { ...memDb.inProgressForm.metadata, ...payload.metadata };
  memDb.inProgressForm = {
    formData: { ...memDb.inProgressForm.formData, ...payload.formData },
    metadata,
  };

  const formIndex = memDb.user.data.attributes.inProgressForms.findIndex(
    form => form.form === '20-10206',
  );

  // get the current time in seconds
  const lastUpdated = Math.floor(Date.now() / 1000);
  const expiresAt = Math.floor(Date.now() / 1000) + 5184000;

  const updatedMetadata = {
    ...memDb.inProgressForm.metadata,
    expiresAt,
    lastUpdated,
    createdAt: lastUpdated - 100,
  };

  // if the form exists, update it
  if (formIndex !== -1) {
    memDb.user.data.attributes.inProgressForms = memDb.user.data.attributes.inProgressForms.map(
      form => {
        if (form.form === '20-10206') {
          return {
            ...form,
            metadata: updatedMetadata,
            expiresAt,
            lastUpdated,
          };
        }
        return form;
      },
    );
  } else {
    // if the form does not exist, add it
    memDb.user.data.attributes.inProgressForms.push({
      form: '20-10206',
      metadata: updatedMetadata,
      lastUpdated,
    });
  }
};

const deleteInProgressForm = () => {
  memDb.inProgressForm = {
    formData: {},
    metadata: {},
  };
  // reset the inProgressForms to an empty array
  memDb.user.data.attributes.inProgressForms = [];
};

// sanitize user input
const sanitize = dirty => {
  if (typeof dirty === 'number' && !Number.isNaN(dirty)) return dirty;
  if (typeof dirty !== 'string') {
    throw new Error('Cannot sanitize, input must be a string');
  }

  return _.escape(dirty).trim();
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
    {
      ...target,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
  );
};

const updateConfig = {
  correspondenceAddress: {
    path: 'data.attributes.vet360ContactInformation.mailingAddress',
    fields: [
      'addressLine1',
      'addressLine2',
      'addressLine3',
      'city',
      'stateCode',
      'zipCode',
      'countryCodeIso2',
      'countryCodeIso3',
      'countryCodeFips',
      'countyCode',
      'countyName',
      'addressPou',
    ],
    transactionId: 'mock-update-mailing-address-success-transaction-id',
    type: 'AsyncTransaction::VAProfile::AddressTransaction',
  },
  'residence/choiceAddress': {
    path: 'data.attributes.vet360ContactInformation.residentialAddress',
    fields: [
      'addressLine1',
      'addressLine2',
      'addressLine3',
      'city',
      'stateCode',
      'zipCode',
      'countryCodeIso2',
      'countryCodeIso3',
      'countryCodeFips',
      'countyCode',
      'countyName',
      'addressPou',
    ],
    transactionId: 'mock-update-residential-address-success-transaction-id',
    type: 'AsyncTransaction::VAProfile::AddressTransaction',
  },
  homePhone: {
    path: 'data.attributes.vet360ContactInformation.homePhone',
    fields: ['areaCode', 'countryCode', 'phoneNumber', 'phoneType'],
    transactionId: 'mock-update-home-phone-success-transaction-id',
    type: 'AsyncTransaction::VAProfile::TelephoneTransaction',
  },
  mobilePhone: {
    path: 'data.attributes.vet360ContactInformation.mobilePhone',
    fields: ['areaCode', 'countryCode', 'phoneNumber', 'phoneType'],
    transactionId: 'mock-update-mobile-phone-success-transaction-id',
    type: 'AsyncTransaction::VAProfile::TelephoneTransaction',
  },
  email: {
    path: 'data.attributes.vet360ContactInformation.email',
    fields: ['emailAddress'],
    transactionId: 'mock-update-email-success-transaction-id',
    type: 'AsyncTransaction::VAProfile::EmailTransaction',
  },
};

const createUpdate = type => data => {
  const config = updateConfig[type];
  const target = _.get(memDb.user, config.path);
  const updatedTarget = updateFields(target, data, config.fields);
  _.set(memDb.user, config.path, updatedTarget);
  return { transactionId: config.transactionId, type: config.type };
};

const generateResponse = (transactionId, type) => ({
  data: {
    id: '',
    type: `async_transaction_va_profile_${type.toLowerCase()}_transactions`,
    attributes: {
      transactionId,
      transactionStatus: 'RECEIVED',
      type,
      metadata: [],
    },
  },
});

const updateMemDb = (req, res = null) => {
  const key = `${req.method} ${req.url}`;
  const body = req.body || {};

  if (key === 'PUT /v0/profile/telephones') {
    const phoneType = body.phoneType.toLowerCase();
    if (phoneType === 'home' || phoneType === 'mobile') {
      const updateType = `${phoneType}Phone`;
      const { transactionId, type } = createUpdate(updateType)(body);
      return generateResponse(transactionId, type);
    }
    throw new Error('Invalid phone type sent to PUT telephones');
  }

  if (
    key === 'PUT /v0/profile/addresses' ||
    key === 'POST /v0/profile/addresses'
  ) {
    const addressType = body.addressPou?.toLowerCase();
    if (
      addressType === 'correspondence' ||
      addressType === 'residence/choice'
    ) {
      const updateType = `${addressType}Address`;
      const { transactionId, type } = createUpdate(updateType)(body);
      return generateResponse(transactionId, type);
    }
    throw new Error('Invalid address type sent to PUT addresses');
  }

  if (key === 'PUT /v0/profile/email_addresses') {
    const { transactionId, type } = createUpdate('email')(body);
    return generateResponse(transactionId, type);
  }

  if (key.includes('GET /v0/user')) {
    return memDb.user;
  }

  if (
    key.includes('GET /v0/in_progress_forms') ||
    key.includes('DELETE /v0/in_progress_forms')
  ) {
    return memDb.inProgressForm;
  }

  if (!res) {
    throw new Error(
      `updateMemDB: Response object is required. or key ${key} not found`,
    );
  }

  return res;
};

module.exports = {
  memDb,
  updateMemDb,
  updateInProgressForm,
  deleteInProgressForm,
};
