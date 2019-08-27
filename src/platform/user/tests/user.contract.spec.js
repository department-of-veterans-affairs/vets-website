import { Pact } from '@pact-foundation/pact';
import { expect } from 'chai';

import { VA_FORM_IDS } from 'platform/forms/constants';
import { refreshProfile } from '../profile/actions';

describe('User API', () => {
  const provider = new Pact({
    port: 3000,
    consumer: 'VA.gov',
    provider: 'VA.gov API',
    spec: 2,
  });

  /* eslint-disable camelcase */
  const EXPECTED_BODY = {
    data: {
      attributes: {
        profile: {
          sign_in: {
            service_name: 'idme',
          },
          email: 'fake@fake.com',
          loa: { current: 3, highest: 3 },
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
          served_in_military: true,
        },
        in_progress_forms: [
          {
            form: VA_FORM_IDS.FORM_10_10EZ,
            metadata: {},
          },
        ],
        prefills_available: [
          VA_FORM_IDS.FORM_21_526EZ,
          VA_FORM_IDS.FORM_22_0994,
        ],
        services: [
          'facilities',
          'hca',
          'edu-benefits',
          'evss-claims',
          'user-profile',
          'health-records',
          'rx',
          'messaging',
          'form-save-in-progress',
          'form-prefill',
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
  };
  /* eslint-enable camelcase */

  before(() => provider.setup());
  after(() => provider.finalize());
  afterEach(() => provider.verify());

  describe('GET /user', () => {
    before(done => {
      provider
        .addInteraction({
          state: 'user is logged in',
          uponReceiving: 'request for current user',
          withRequest: {
            method: 'GET',
            path: '/v0/user',
          },
          willRespondWith: {
            status: 200,
            body: EXPECTED_BODY,
            headers: {
              'Content-Type': 'application/json',
            },
          },
        })
        .then(() => {
          done();
        });
    });

    it('responds with success', () => {
      const dispatch = () => {};
      const response = refreshProfile()(dispatch);
      expect(response).to.eventually.eql(EXPECTED_BODY);
    });
  });
});
