import contractTest from 'platform/testing/contract';

import { fetchPersonalInformation } from 'applications/personalization/profile360/actions/index.js';
import { Matchers } from '@pact-foundation/pact';
import { like } from '@pact-foundation/pact/dsl/matchers';
import sinon from 'sinon';

const { term } = Matchers;

const dispatch = sinon.stub();

contractTest('VA Profile', 'VA.gov API', mockApi => {
  describe('GET /v0/profile/personal_information', () => {
    it('it responds with status 200 when a successful fetch', async () => {
      await mockApi().addInteraction({
        state: 'response is OK',
        uponReceiving: 'a request for personal information data',
        withRequest: {
          method: 'GET',
          path: '/v0/profile/personal_information',
          headers: {
            'X-Key-Inflection': 'camel',
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
            data: like({
              attributes: {
                gender: 'M',
                birthDate: '1949-03-04',
              },
            }),
          },
        },
      });
      await fetchPersonalInformation()(dispatch);
    });

    it('responds with a 401 error when the user is unauthorized', async () => {
      await mockApi().addInteraction({
        state: 'not authorized',
        uponReceiving: 'a GET request',
        withRequest: {
          method: 'GET',
          path: '/v0/service_history',
          headers: {
            'X-Key-Inflection': 'camel',
          },
        },
        willRespondWith: {
          status: 401,
          headers: {
            'Content-Type': term({
              matcher: '^application/json',
              generate: 'application/json',
            }),
          },
          // What we really want to test is: "the `errors` array contains at
          // least one object that has a code value of '401'". I think this test
          // will fail if `errors` contains more than one element
          errors: [
            like({
              status: '401',
            }),
          ],
        },
      });

      await fetchPersonalInformation()(dispatch);
    });

    it('responds with a 502 error the response body is unexpected', async () => {
      await mockApi().addInteraction({
        state: 'unexpected response body',
        uponReceiving: 'a GET request',
        withRequest: {
          method: 'GET',
          path: '/v0/service_history',
          headers: {
            'X-Key-Inflection': 'camel',
          },
        },
        willRespondWith: {
          status: 502,
          headers: {
            'Content-Type': term({
              matcher: '^application/json',
              generate: 'application/json',
            }),
          },
          // What we really want to test is: "the `errors` array contains at
          // least one object that has a code value of '401'". I think this test
          // will fail if `errors` contains more than one element
          errors: [
            like({
              status: '502',
            }),
          ],
        },
      });

      await fetchPersonalInformation()(dispatch);
    });
  });
});
