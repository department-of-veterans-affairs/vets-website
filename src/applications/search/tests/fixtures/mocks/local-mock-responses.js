// use this file to mock api responses for local development
// yarn mock-api --responses ./src/applications/search/tests/fixtures/mocks/local-mock-responses.js
const featureToggles = require('./feature-toggles.json');
const user = require('./user.json');
const stub = require('../../../constants/stub.json');
const stubPage2 = require('../../../constants/stub-page-2.json');
const stubNewTerm = require('../../../constants/stub-new-term.json');
const stubZeroResults = require('../../../constants/stubZeroResults.json');

const responses = {
  'GET /v0/feature_toggles': featureToggles,
  'GET /v0/user': user,
  'GET /v0/search': (req, res) => {
    const query = req.query?.query;
    const page = req.query?.page;

    if (!query) {
      return res.json(stubZeroResults);
    }

    if (query === 'benefits' && page === '2') {
      return res.json(stubPage2);
    }

    if (query === 'benefits') {
      return res.json(stub);
    }

    if (query === 'military') {
      return res.json(stubNewTerm);
    }

    return res.json(stubZeroResults);
  },
};

module.exports = responses;

