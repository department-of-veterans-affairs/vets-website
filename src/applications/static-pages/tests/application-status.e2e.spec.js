const E2eHelpers = require('platform/testing/e2e/helpers');
const Timeouts = require('platform/testing/e2e/timeouts.js');
const Auth = require('platform/testing/e2e/auth');
const VA_FORM_IDS = require('platform/forms/constants').VA_FORM_IDS;

function testStatus(client, page, url) {
  client
    .openUrl(`${E2eHelpers.baseUrl}${page}`)
    .waitForElementVisible('.sip-application-status', Timeouts.slow)
    .axeCheck('.main');

  E2eHelpers.overrideScrolling(client);

  client.expect
    .element('main a.usa-button-primary')
    .to.have.attribute('href')
    .contains(url);

  client
    .waitForElementPresent('.usa-button-secondary', Timeouts.normal)
    .moveTo('.usa-button-secondary', 0, 200)
    .click('.usa-button-secondary')
    .waitForElementPresent('#start-over-modal-title', Timeouts.normal)
    .expect.element('#start-over-modal-title')
    .text.equals('Starting over will delete your in-progress application.');

  client.axeCheck('.main');
}

module.exports = E2eHelpers.createE2eTest(client => {
  const token = Auth.getUserToken();

  Auth.logIn(token, client, '/', 3);

  /* eslint-disable camelcase */
  client.mockData(
    {
      path: '/v0/user',
      verb: 'get',
      value: {
        data: {
          attributes: {
            profile: {
              sign_in: {
                service_name: 'idme',
              },
              email: 'fake@fake.com',
              loa: { current: 3 },
              first_name: 'Jane',
              middle_name: '',
              last_name: 'Doe',
              gender: 'F',
              birth_date: '1985-01-01',
              verified: true,
            },
            veteran_status: {
              status: 'OK',
              is_veteran: true,
            },
            in_progress_forms: [
              {
                form: VA_FORM_IDS.FORM_10_10EZ,
                metadata: {},
              },
              {
                form: VA_FORM_IDS.FORM_22_1995,
                metadata: {},
              },
              {
                form: VA_FORM_IDS.FORM_21P_530,
                metadata: {},
              },
              {
                form: VA_FORM_IDS.FORM_21P_527EZ,
                metadata: {},
              },
            ],
            prefills_available: [],
            services: [
              'facilities',
              'hca',
              'edu-benefits',
              'evss-claims',
              'user-profile',
              'rx',
              'messaging',
            ],
            va_profile: {
              status: 'OK',
              birth_date: '19511118',
              family_name: 'Hunter',
              gender: 'M',
              given_names: ['Julio', 'E'],
              active_status: 'active',
            },
          },
        },
        meta: { errors: null },
      },
    },
    token,
  );
  /* eslint-enable camelcase */

  testStatus(
    client,
    '/health-care/how-to-apply/',
    '/health-care/apply/application/resume',
  );
  testStatus(
    client,
    '/health-care/eligibility',
    '/health-care/apply/application/resume',
  );

  testStatus(
    client,
    '/pension/how-to-apply/',
    '/pension/application/527EZ/resume',
  );
  testStatus(
    client,
    '/pension/eligibility',
    '/pension/application/527EZ/resume',
  );

  testStatus(
    client,
    '/burials-memorials/veterans-burial-allowance/',
    '/burials-and-memorials/application/530/resume',
  );

  testStatus(
    client,
    '/education/how-to-apply/',
    '/education/apply-for-education-benefits/application/1995/resume',
  );
  testStatus(
    client,
    '/education/eligibility',
    '/education/apply-for-education-benefits/application/1995/resume',
  );
  client.end();
});
