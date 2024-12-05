const { permanentAddress, temporaryAddress } = require('./addresses');
// eslint-disable-next-line no-unused-vars
const { unauthenticated, internalServerError, notFound } = require('./errors');
const { supplies } = require('./supplies');
// const supplies = [];

const getOk = {
  formData: {
    fullName: {
      first: 'Greg',
      middle: 'A',
      last: 'Anderson',
    },
    permanentAddress,
    temporaryAddress,
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

module.exports = {
  // `GET /v0/in_progress_forms/${VA_FORM_IDS.FORM_VA_2346A}`: getOk,
  'GET /v0/in_progress_forms/MDOT': getOk,
  'OPTIONS /v0/in_progress_forms/MDOT': 'OK',
  // 'GET /v0/in_progress_forms/MDOT': (_, res) => res.status(404).json(notFound),
  // 'GET /v0/in_progress_forms/MDOT': (_, res) => res.status(500).json(internalServerError),
  'PUT /v0/in_progress_forms/MDOT': putOk,
};
