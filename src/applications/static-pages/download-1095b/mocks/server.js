const delay = require('mocker-api/lib/delay');
const fs = require('fs');
const path = require('path');
const user = require('./endpoints/user');
const { delaySingleResponse } = require('./script/utils');
// const error500 = require('../tests/fixtures/500.json');

const responses = {
  'GET /v0/feature_toggles': (req, res) => {
    // Use FORM_1095B_MULTIPLE_YEARS to set a default for mocks.
    const envValue = process?.env?.FORM_1095B_MULTIPLE_YEARS;
    const isForm1095bMultipleYears = envValue === 'true';

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
          { year: 2024, lastUpdated: '2024-02-03T18:50:40.548Z' },
          { year: 2023, lastUpdated: '2023-02-03T18:50:40.548Z' },
          { year: 2022, lastUpdated: '2022-02-03T18:50:40.548Z' },
          { year: 2025, lastUpdated: '2025-02-03T18:50:40.548Z' },
        ],
      });
    }, secondsOfDelay);
  },
  'GET /v0/form1095_bs/download_pdf/:taxYear': (req, res) => {
    const { taxYear } = req.params || {};
    res.set('Content-Type', 'application/pdf');
    res.set(
      'Content-Disposition',
      `inline; filename="1095B_${taxYear || 'unknown'}.pdf"`,
    );
    const pdfPath = path.resolve(
      __dirname,
      '../tests/e2e/fixtures/1095BTestFixture.pdf',
    );
    if (taxYear === '2023') {
      return res.status(500).json({ errors: [{ title: 'Mock PDF error' }] });
    }
    try {
      const pdfBuffer = fs.readFileSync(pdfPath);
      return res.send(pdfBuffer);
    } catch (_error) {
      return res.send(Buffer.from('%PDF-1.4\n%%EOF', 'utf-8'));
    }
  },
  'GET /v0/form1095_bs/download_txt/:taxYear': (req, res) => {
    const { taxYear } = req.params || {};
    res.set('Content-Type', 'text/plain');
    res.set(
      'Content-Disposition',
      `inline; filename="1095B_${taxYear || 'unknown'}.txt"`,
    );
    const txtPath = path.resolve(
      __dirname,
      '../tests/e2e/fixtures/1095BTestFixture.txt',
    );
    if (taxYear === '2023') {
      return res.status(500).json({ errors: [{ title: 'Mock TXT error' }] });
    }
    try {
      const txtContent = fs.readFileSync(txtPath, 'utf-8');
      return res.send(txtContent);
    } catch (_error) {
      return res.send(`Mock 1095-B text for tax year ${taxYear || 'unknown'}`);
    }
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
