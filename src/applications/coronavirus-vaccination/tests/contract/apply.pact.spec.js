import contractTest from 'platform/testing/contract';
// import sinon from 'sinon';
// import { expect } from 'chai';
import {
  // decimal,
  // eachLike,
  // integer,
  // like,
  // string,
  term,
} from '@pact-foundation/pact/dsl/matchers';
import { apiPostRequest } from '../../apiCalls/';
import environment from 'platform/utilities/environment';
import authenticatedApplicationData from '../cypress/fixtures/data/authenticated-coronavirus-vaccination-application.json';
import unauthenticatedApplicationData from '../cypress/fixtures/data/unauthenticated-coronavirus-vaccination-application.json';

contractTest('coronavirus-vaccination', 'VA.gov API', mockApi => {
  describe('POST /registration', () => {
    it('Authenticated success case: submit valid form will return a 201 Created HTTP response', async () => {
      const authenticatedApiUrl = `${
        environment.API_URL
      }/covid_vaccine/v0/registration`;

      const interaction = {
        state: 'authenticated user application data',
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
          // body: like({}),
        },
      };

      await mockApi().addInteraction(interaction);

      apiPostRequest(authenticatedApiUrl, authenticatedApplicationData);
    });
  });

  describe('POST /registration/unauthenticated', () => {
    it('Unauthenticated success case: submit valid form will return a 201 Created HTTP response', async () => {
      const authenticatedApiUrl = `${
        environment.API_URL
      }/covid_vaccine/v0/registration`;
      const unauthenticatedApiUrl = `${authenticatedApiUrl}/unauthenticated`;

      const interaction = {
        state: 'unauthenticated user application data',
        uponReceiving: 'a POST request',
        withRequest: {
          method: 'POST',
          path: '/covid_vaccine/v0/registration/unauthenticated',
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
          // body: like({}),
        },
      };

      await mockApi().addInteraction(interaction);

      apiPostRequest(unauthenticatedApiUrl, unauthenticatedApplicationData);
    });
  });
});
