const mock = require('./mock-helpers');

function initMHVTermsMocks(token, termsName = 'mhvac') {
  mock(token, {
    path: `/v0/terms_and_conditions/${termsName}/versions/latest`,
    verb: 'get',
    value: {
      data: {
        id: '1',
        type: 'termsAndConditions',
        attributes: {
          name: 'mhvac',
        }
      }
    }
  });

  mock(token, {
    path: `/v0/terms_and_conditions/${termsName}/versions/latest/user_data`,
    verb: 'get',
    value: {
      data: {
        id: '1',
        type: 'termsAndConditions',
        attributes: {
          createdAt: 'today',
        }
      }
    }
  });

  mock(token, {
    path: `/v0/terms_and_conditions/${termsName}/versions/latest/user_data`,
    verb: 'post',
    value: {
      data: {}
    }
  });
}

module.exports = {
  initMHVTermsMocks,
};
