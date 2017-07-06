const mock = require('./mock-helpers');
const Timeouts = require('./timeouts.js');
const LoginHelpers = require('./login-helpers.js');

function completeClaimantInformation(client, data) {
  client
    .waitForElementVisible('input[name="root_claimantFullName_first"]', Timeouts.normal)
    .fillName('root_claimantFullName', data.claimantFullName)
    .selectRadio('root_relationship_type', data.relationship.type);

  if (data.relationship.type === 'other') {
    client
      .fill('input[name="root_relationship_other"]', data.relationship.other)
      // Not sure what to do with this, exactly, but I'll make it an option.
      .clickIf('#root_relationship_view:isEntity', data.relationship.isEntity);
  }
}


function initApplicationSubmitMock() {
  mock(null, {
    path: '/v0/burial_claims',
    verb: 'post',
    value: {
      formSubmissionId: '123fake-submission-id-567',
      timestamp: '2016-05-16'
    }
  });
}

function initSaveInProgressMock(url, client) {
  const token = LoginHelpers.getUserToken();

  mock(null, {
    path: '/v0/burial_claims',
    verb: 'post',
    value: {
      formSubmissionId: '123fake-submission-id-567',
      timestamp: '2016-05-16'
    }
  });

  /* eslint-disable camelcase */
  mock(token, {
    path: '/v0/sessions',
    verb: 'delete',
    value: {
      logout_via_get: 'http://fake'
    }
  });

  mock(token, {
    path: '/v0/sessions/new',
    verb: 'get',
    value: {
      logout_via_get: 'http://fake'
    }
  });

  mock(token, {
    path: '/v0/user',
    verb: 'get',
    value: {
      data: {
        attributes: {
          profile: {
            email: 'fake@fake.com',
            loa: {
              current: 3
            },
            first_name: 'Jane',
            middle_name: '',
            last_name: 'Doe',
            gender: 'F',
            birth_date: '1985-01-01',
          },
          in_progress_forms: [{
            form: '1010ez'
          }],
          prefills_available: [],
          services: ['facilities', 'hca', 'edu-benefits', 'evss-claims', 'user-profile', 'rx', 'messaging'],
          va_profile: {
            status: 'OK',
            birth_date: '19511118',
            family_name: 'Hunter',
            gender: 'M',
            given_names: ['Julio', 'E'],
            active_status: 'active'
          }
        }
      }
    }
  });

  mock(token, {
    path: '/v0/in_progress_forms/1010ez',
    verb: 'get',
    value: {
      form_data: {
        privacyAgreementAccepted: false,
        veteranSocialSecurityNumber: '123445544',
        veteranFullName: {
        },
        'view:placeOfBirth': {
        },
        'view:demographicCategories': {
        },
        isSpanishHispanicLatino: false,
        veteranAddress: {
          country: 'USA'
        },
        spouseFullName: {

        },
        isEssentialAcaCoverage: false,
        'view:preferredFacility': {
        },
        'view:locator': {

        }
      },
      metadata: {
        version: 0,
        returnUrl: '/veteran-information/birth-information',
        savedAt: 1498588443698,
        expires_at: 1503772443,
        last_updated: 1498588443
      }
    }
  });
  mock(token, {
    path: '/v0/in_progress_forms/21P-530',
    verb: 'put',
    value: {
    }
  });
  /* eslint-enable camelcase */

  client
    .url(url)
    .waitForElementVisible('body', Timeouts.normal);

  LoginHelpers.setUserToken(token, client);
}

module.exports = {
  completeClaimantInformation,
  initApplicationSubmitMock,
  initSaveInProgressMock
};
