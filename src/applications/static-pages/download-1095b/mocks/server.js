const delay = require('mocker-api/lib/delay');
const user = require('./endpoints/user');
const { delaySingleResponse } = require('./script/utils');
// const error500 = require('../tests/fixtures/500.json');

const responses = {
  'GET /v0/feature_toggles': (req, res) => {
    const queryValue = req?.query?.form1095bMultipleYears;
    const envValue = process?.env?.FORM_1095B_MULTIPLE_YEARS;
    let isForm1095bMultipleYears = envValue === 'true';

    if (queryValue === 'true') {
      isForm1095bMultipleYears = true;
    } else if (queryValue === 'false') {
      isForm1095bMultipleYears = false;
    }

    return res.json({
      data: {
        type: 'feature_toggles',
        features: [
          {
            name: 'form1095b_multiple_years',
            value: isForm1095bMultipleYears,
          },
        ],
      },
    });
  },
  'GET /v0/mock_session': (_req, res) => {
    return res.json({ hasSession: true });
  },
  'GET /data/cms/vamc-ehr.json': (_req, res) => {
    return res.json({});
  },
  'GET /v0/form1095_bs/available_forms': (_req, res) => {
    const secondsOfDelay = 1;
    delaySingleResponse(() => {
      res.json({
        availableForms: [
          { year: 2025, lastUpdated: '2025-02-03T18:50:40.548Z' },
          { year: 2024, lastUpdated: '2024-02-03T18:50:40.548Z' },
          { year: 2023, lastUpdated: '2023-02-03T18:50:40.548Z' },
        ],
      });
    }, secondsOfDelay);
  },
  // Uncomment this and import statement to mock a 500 error
  // 'GET /v0/form1095_bs/available_forms': (_req, res) => {
  //   return res.status(500).json(error500);
  // },

  'GET /v0/user': (_req, res) => {
    // example user data cases
    return res.json(user.loa3User72); // default user LOA3 w/id.me (success)
    // return res.json(user.loa1User); // LOA1 user w/id.me
    // return res.json(user.loa1UserDSLogon); // LOA1 user w/dslogon
    // return res.json(user.loa1UserLoginGov); // LOA1 user w/login.gov
    // return res.json(user.loa1UserMHV); // LOA1 user w/mhv
  },
};

// here we can run anything that needs to happen before the mock server starts up
// this runs every time a file is mocked
const generateMockResponses = () => {
  // set DELAY=1000 when running mock server script
  // to add 1 sec delay to all responses
  const responseDelay = process?.env?.DELAY || 0;

  return responseDelay > 0 ? delay(responses, responseDelay) : responses;
};

module.exports = generateMockResponses();
