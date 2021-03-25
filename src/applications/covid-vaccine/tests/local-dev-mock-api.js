const commonResponses = require('../../../platform/testing/local-dev-mock-api/common');

const responses = {
  ...commonResponses,

  'GET /v0/vaccine_locations': {
    data: {
      locations: [
        {
          id: 1,
          name: 'Durham VA Medical Center',
          street: '123 Main St',
          city: 'Durham',
          state: 'NC',
          zip: '27514',
        },
        {
          id: 2,
          name: 'VA Location Two',
          street: '456 Elm St',
          city: 'Fayetteville',
          state: 'NC',
          zip: '27444',
        },
        {
          id: 3,
          name: 'VA Location Three',
          street: '789 Main St',
          city: 'Greensboro',
          state: 'NC',
          zip: '26564',
        },
      ],
    },
  },
};

module.exports = responses;
