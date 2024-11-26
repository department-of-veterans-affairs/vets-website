const supplies = [
  {
    productName: 'ERHK HE11 680 MINI',
    productGroup: 'Accessory',
    productId: 6584,
    availableForReorder: true,
    lastOrderDate: '2022-05-16',
    nextAvailabilityDate: '2022-10-16',
    quantity: 5,
  },
  {
    productName: 'AIRFIT F10 M',
    productGroup: 'Apnea',
    productId: 6641,
    availableForReorder: true,
    lastOrderDate: '2022-07-05',
    nextAvailabilityDate: '2022-12-05',
    quantity: 1,
  },
  {
    productName: 'AIRFIT P10',
    productGroup: 'Apnea',
    productId: 6650,
    availableForReorder: true,
    lastOrderDate: '2022-07-05',
    nextAvailabilityDate: '2022-12-05',
    quantity: 1,
  },
  {
    productName: 'AIRCURVE10-ASV-CLIMATELINE',
    productGroup: 'Apnea',
    productId: 8467,
    lastOrderDate: '2022-07-06',
    nextAvailabilityDate: '2022-12-06',
    quantity: 1,
  },
];

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

// eslint-disable-next-line no-unused-vars
const unauthenticated = {
  errors: [
    {
      title: 'Not authorized',
      detail: 'Not authorized',
      code: '401',
      status: '401',
    },
  ],
};

// eslint-disable-next-line no-unused-vars
const internalServerError = {
  errors: [
    {
      title: 'Internal server error',
      detail: 'Internal server error',
      code: '500',
      status: '500',
    },
  ],
};

// eslint-disable-next-line no-unused-vars
const notFound = {
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
