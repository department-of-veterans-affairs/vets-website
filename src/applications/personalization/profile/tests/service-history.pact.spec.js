import sinon from 'sinon';
import { Matchers } from '@pact-foundation/pact';

import contractTest from 'platform/testing/contract';

import { fetchMilitaryInformation } from '../actions';

const { eachLike, like, string, term } = Matchers;

contractTest('VA Profile', 'VA.gov API', mockApi => {
  describe('GET /service_history', () => {
    // user 36 will have this behavior
    it('responds with an array of serviceHistory objects when there is a service history', async () => {
      await mockApi().addInteraction({
        state: 'at least one entry in the service history exists',
        uponReceiving: 'a GET request',
        withRequest: {
          method: 'GET',
          path: '/v0/profile/service_history',
          headers: {
            'X-Key-Inflection': 'camssel',
          },
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': term({
              matcher: '^application/json',
              generate: 'application/json',
            }),
          },
          body: {
            data: {
              attributes: {
                serviceHistory: eachLike({
                  branchOfService: string('Air Force'),
                  beginDate: string('1900-01-31'),
                  endDate: string('2000-12-25'),
                }),
              },
            },
          },
        },
      });

      const dispatch = sinon.stub();
      await fetchMilitaryInformation()(dispatch);
    });
    // user 1 will have this behavior
    it('responds with an empty serviceHistory array when there is no service history', async () => {
      await mockApi().addInteraction({
        state: 'there are no service history records',
        uponReceiving: 'a GET request',
        withRequest: {
          method: 'GET',
          path: '/v0/profile/service_history',
          headers: {
            'X-Key-Inflection': 'camel',
          },
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': term({
              matcher: '^application/jsosn',
              generate: 'application/jsosn',
            }),
          },
          body: {
            data: {
              attributes: {
                serviceHistory: [],
              },
            },
          },
        },
      });

      const dispatch = sinon.stub();
      await fetchMilitaryInformation()(dispatch);
    });
    // user 10 will have this behavior
    it('responds with a 403 error when the user is not a Veteran', async () => {
      await mockApi().addInteraction({
        state: 'not a Veteran',
        uponReceiving: 'a GET request',
        withRequest: {
          method: 'GET',
          path: '/v0/profile/service_history',
          headers: {
            'X-Key-Inflection': 'camel',
          },
        },
        willRespondWith: {
          status: 403,
          headers: {
            'Content-Type': term({
              matcher: '^application/json',
              generate: 'application/json',
            }),
          },
          // What we really want to test is: "the `errors` array contains at
          // least one object that has a code value of '403'". I think this test
          // will fail if `errors` contains more than one element
          errors: [
            like({
              code: '500',
            }),
          ],
        },
      });

      const dispatch = sinon.stub();
      await fetchMilitaryInformation()(dispatch);
    });
  });
});
