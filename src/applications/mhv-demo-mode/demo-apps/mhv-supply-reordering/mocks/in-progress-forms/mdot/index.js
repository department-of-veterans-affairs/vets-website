// eslint-disable-next-line no-unused-vars
const { internalServerError, unprocessableEntity } = require('../../errors');
const { supplies } = require('./supplies');
// const supplies = [];

const getOk = {
  formData: {
    fullName: {
      first: 'Greg',
      middle: 'A',
      last: 'Anderson',
    },
    permanentAddress: {
      street: '101 EXAMPLE STREET',
      street2: 'APT 2',
      city: 'KANSAS CITY',
      state: 'MO',
      country: 'UNITED STATES',
      postalCode: '64117',
    },
    temporaryAddress: {
      street: 'PSC 1234 BOX 12345',
      street2: ', ',
      city: 'APO',
      state: 'AE',
      country: 'ARMED FORCES AF,EU,ME,CA',
      postalCode: '09324',
    },
    ssnLastFour: '1200',
    gender: 'M',
    vetEmail: 'vets.gov.user+1@gmail.com',
    dateOfBirth: '1933-04-05',
    eligibility: {
      accessories: true,
      apneas: true,
      batteries: true,
    },
    supplies,
  },
  metadata: {
    version: 0,
    prefill: true,
    returnUrl: '/veteran-information',
  },
};

const putOk = {
  data: {
    id: '12345',
    type: 'in_progress_forms',
    attributes: {
      formId: 'MDOT',
      createdAt: '',
      updatedAt: '',
      metadata: {},
    },
  },
};

// eslint-disable-next-line no-unused-vars
const getNotFound = {
  errors: [
    {
      title: 'Veteran Not Found',
      detail: 'The veteran could not be found',
      code: 'MDOT_invalid',
      source: 'MDOT::Client',
      status: '404',
    },
  ],
};

// eslint-disable-next-line no-unused-vars
const getInternalServerError = {
  errors: [
    {
      title: 'Internal Server Error',
      detail: 'The system of record was unable to process this request.',
      code: 'MDOT_internal_server_error',
      source: 'MDOT::Client',
      status: '500',
    },
  ],
};

// eslint-disable-next-line no-unused-vars
const getParsingError = {
  errors: [
    {
      title: 'Bad Gateway',
      detail: 'Received an an invalid response from the upstream server',
      code: 'MDOT_502',
      source: 'MDOT::Client',
      status: '502',
    },
  ],
};

// eslint-disable-next-line no-unused-vars
const getServiceUnavailable = {
  errors: [
    {
      title: 'Service Unavailable',
      detail: 'The DLC API is currently unavailable',
      code: 'MDOT_service_unavailable',
      source: 'MDOT::Client',
      status: '503',
    },
  ],
};

module.exports = {
  // `GET /v0/in_progress_forms/${VA_FORM_IDS.FORM_VA_2346A}`: getOk,
  'GET /v0/in_progress_forms/MDOT': getOk,
  // 'GET /v0/in_progress_forms/MDOT': (_, res) => res.status(404).json(getNotFound), // prettier-ignore
  // 'GET /v0/in_progress_forms/MDOT': (_, res) => res.status(500).json(getInternalServerError), // prettier-ignore
  // 'GET /v0/in_progress_forms/MDOT': (_, res) => res.status(502).json(getParsingError), // prettier-ignore
  // 'GET /v0/in_progress_forms/MDOT': (_, res) => res.status(503).json(getServiceUnavailable), // prettier-ignore
  'OPTIONS /v0/in_progress_forms/MDOT': 'OK',
  'PUT /v0/in_progress_forms/MDOT': putOk,
  // 'PUT /v0/in_progress_forms/MDOT': (_, res) => res.status(404).json(notFound),
  // 'PUT /v0/in_progress_forms/MDOT': (_, res) => res.status(422).json(unprocessableEntity), // prettier-ignore
  // 'PUT /v0/in_progress_forms/MDOT': (_, res) => res.status(500).json(internalServerError), // prettier-ignore
};
