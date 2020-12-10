import contractTest from 'platform/testing/contract';
import { like, term } from '@pact-foundation/pact/dsl/matchers';
import {
  apiGetRequest,
  apiPostRequest,
  apiPatchRequest,
} from '../../apiCalls/';
import environment from 'platform/utilities/environment';
import authenticatedApplicationData from '../cypress/fixtures/data/authenticated-coronavirus-vaccination-application.json';
import unauthenticatedApplicationData from '../cypress/fixtures/data/unauthenticated-coronavirus-vaccination-application.json';

contractTest('Coronavirus Vaccination', 'VA.gov API', mockApi => {
  describe('GET /registration', () => {
    it('authenticated success case: request for saved registration will return a 200 OK HTTP response', async () => {
      const url = `${environment.API_URL}/covid_vaccine/v0/registration`;

      const interaction = {
        state: 'retreives saved registration for authenticated user',
        uponReceiving: 'a GET request',
        withRequest: {
          method: 'GET',
          path: '/covid_vaccine/v0/registration',
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
            data: like({}), // waiting for example data
          },
        },
      };

      await mockApi().addInteraction(interaction);

      await apiGetRequest(url);
    });
  });

  describe('POST /registration', () => {
    it('authenticated success case: submit valid registration will return a 201 Created HTTP response', async () => {
      const url = `${environment.API_URL}/covid_vaccine/v0/registration`;

      const interaction = {
        state: 'authenticated user sumbits registration data',
        uponReceiving: 'a POST request',
        withRequest: {
          method: 'POST',
          path: '/covid_vaccine/v0/registration',
          headers: {
            'X-Key-Inflection': 'camel',
            'Content-Type': 'application/json',
          },
          body: authenticatedApplicationData,
        },
        willRespondWith: {
          status: 201,
          headers: {
            'Content-Type': term({
              matcher: '^application/json',
              generate: 'application/json',
            }),
          },
          body: {
            data: {
              id: like('C2B0CCBC18AFD5A489160753194205616'),
              type: 'covid_vaccine_v0_registration_submissions',
              attributes: {
                createdAt: like('2020-12-09T16:39:02.153Z'),
              },
            },
          },
        },
      };

      await mockApi().addInteraction(interaction);

      await apiPostRequest(url, authenticatedApplicationData);
    });

    it('unauthenticated success case: submit valid registration will return a 201 Created HTTP response', async () => {
      const url = `${environment.API_URL}/covid_vaccine/v0/registration`;

      const interaction = {
        state: 'unauthenticated user sumbits registration data',
        uponReceiving: 'a POST request',
        withRequest: {
          method: 'POST',
          path: '/covid_vaccine/v0/registration',
          headers: {
            'X-Key-Inflection': 'camel',
            'Content-Type': 'application/json',
          },
          body: unauthenticatedApplicationData,
        },
        willRespondWith: {
          status: 201,
          headers: {
            'Content-Type': term({
              matcher: '^application/json',
              generate: 'application/json',
            }),
          },
          body: {
            data: {
              id: like('C2B0CCBC18AFD5A489160753194205616'),
              type: 'covid_vaccine_v0_registration_submissions',
              attributes: {
                createdAt: like('2020-12-09T16:39:02.153Z'),
              },
            },
          },
        },
      };

      await mockApi().addInteraction(interaction);

      await apiPostRequest(url, unauthenticatedApplicationData);
    });
  });

  // I JUST FOUND OUT THAT THE UPDATE WILL ALSO BE A POST REQUEST. WAITING FOR MORE DETAILS.
  describe('PATCH /registration', () => {
    it('authenticated success case: submit valid updated registration will return a 204 No Content HTTP response', async () => {
      const url = `${environment.API_URL}/covid_vaccine/v0/registration`; // might need to be updated

      const interaction = {
        state: 'authenticated user updates registration data',
        uponReceiving: 'a PATCH request',
        withRequest: {
          method: 'PATCH',
          path: '/covid_vaccine/v0/registration', // might need to be updated
          headers: {
            'X-Key-Inflection': 'camel',
            'Content-Type': 'application/json',
          },
          body: authenticatedApplicationData, // might need to be updated
        },
        willRespondWith: {
          status: 204, // might need to be updated
          headers: {
            'Content-Type': term({
              matcher: '^application/json',
              generate: 'application/json',
            }),
          },
          body: {
            data: like({}), // needs to be updated
          },
        },
      };

      await mockApi().addInteraction(interaction);

      await apiPatchRequest(url, authenticatedApplicationData);
    });
  });
});
