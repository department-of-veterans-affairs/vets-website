import contractTest from 'platform/testing/contract';

import { loadConnectedApps } from 'applications/personalization/profile-2/components/connected-apps/actions';
import { eachLike } from '@pact-foundation/pact/dsl/matchers';
import sinon from 'sinon';

const dispatch = sinon.stub();

contractTest('VA Profile', 'VA.gov API', mockApi => {
  describe('GET /v1/profile/connected_applications', () => {
    it('responds with status 200 for connected apps when apps exist', async () => {
      await mockApi().addInteraction({
        state: 'user has connected apps',
        uponReceiving: 'a request for connected apps data',
        withRequest: {
          method: 'GET',
          path: '/v1/profile/connected_applications',
          headers: {
            'X-Key-Inflection': 'camel',
          },
        },
        willRespondWith: {
          status: 200,
          body: {
            data: eachLike({
              id: '1972660348',
              type: 'provider',
              attributes: {
                created: '2020-06-09T00:42:41.798Z',
                grants: [
                  { title: 'hello' },
                  { title: 'hello' },
                  { title: 'hello' },
                ],
                logo: 'logoURL',
                title: 'Random title',
              },
            }),
          },
        },
      });
      await loadConnectedApps()(dispatch);
    });

    it('responds an empty array for connected apps when no connected apps exist', async () => {
      await mockApi().addInteraction({
        state: 'user has connected apps',
        uponReceiving: 'a request for connected apps data',
        withRequest: {
          method: 'GET',
          path: '/v1/profile/connected_applications',
          headers: {
            'X-Key-Inflection': 'camel',
          },
        },
        willRespondWith: {
          status: 200,
          body: {
            data: [],
          },
        },
      });

      await loadConnectedApps()(dispatch);
    });
  });
});
