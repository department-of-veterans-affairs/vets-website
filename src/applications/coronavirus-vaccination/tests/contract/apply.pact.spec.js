import contractTest from 'platform/testing/contract';
import { Matchers } from '@pact-foundation/pact';

const { like, term } = Matchers;

import { retrievePreviouslySubmittedForm, saveForm } from '../../api/';
import authenticatedApplicationData from '../cypress/fixtures/data/authenticated-coronavirus-vaccination-application.json';
import unauthenticatedApplicationData from '../cypress/fixtures/data/unauthenticated-coronavirus-vaccination-application.json';

contractTest('Coronavirus Vaccination', 'VA.gov API', mockApi => {
  describe('GET /registration', () => {
    context('saved registration exists', () => {
      it('returns a 200 OK HTTP response and the registration data', async () => {
        const interaction = {
          state: 'registration data exists',
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
              data: {
                id: like('BC79619E54A14BFF0D1607952232618112202'),
                type: 'covid_vaccine_v0_registration_submissions',
                attributes: like({
                  createdAt: '2020-12-14T13:23:52.929Z',
                  vaccineInterest: 'INTERESTED',
                  zipCode: '10001',
                  zipCodeDetails: 'Yes',
                  phone: '1112223333',
                  email: 'test@example.com',
                  firstName: 'JAMES',
                  lastName: 'BECK',
                  birthDate: '1989-11-11',
                }),
              },
            },
          },
        };

        await mockApi().addInteraction(interaction);

        await retrievePreviouslySubmittedForm();
      });
    });

    context('saved registration does not exist', () => {
      it('returns a 404 Not Found HTTP response and errors', async () => {
        const interaction = {
          state: 'registration data does not exist',
          uponReceiving: 'a GET request',
          withRequest: {
            method: 'GET',
            path: '/covid_vaccine/v0/registration',
            headers: {
              'X-Key-Inflection': 'camel',
            },
          },
          willRespondWith: {
            status: 404,
            headers: {
              'Content-Type': term({
                matcher: '^application/json',
                generate: 'application/json',
              }),
            },
            body: {
              errors: [
                {
                  title: 'Record not found',
                  detail: 'The record identified by  could not be found',
                  code: '404',
                  status: '404',
                },
              ],
            },
          },
        };

        await mockApi().addInteraction(interaction);

        try {
          await retrievePreviouslySubmittedForm();
        } catch (e) {
          // Catch the 404 error.
        }
      });
    });
  });

  describe('POST /registration', () => {
    context('authenticated user with valid registration', () => {
      it('returns a 201 Created HTTP response', async () => {
        const interaction = {
          state: 'authenticated user submits registration data',
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
                id: '',
                type: 'covid_vaccine_v0_registration_submissions',
                attributes: like({
                  createdAt: '2020-12-14T13:23:52.929Z',
                  vaccineInterest: 'INTERESTED',
                  zipCode: '10001',
                }),
              },
            },
          },
        };

        await mockApi().addInteraction(interaction);

        await saveForm(authenticatedApplicationData);
      });
    });

    context('unauthenticated user with valid registration', () => {
      it('returns a 201 Created HTTP response', async () => {
        const interaction = {
          state: 'unauthenticated user submits registration data',
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
                id: '',
                type: 'covid_vaccine_v0_registration_submissions',
                attributes: like({
                  createdAt: '2020-12-14T13:23:52.929Z',
                  vaccineInterest: 'INTERESTED',
                  zipCode: '10001',
                }),
              },
            },
          },
        };

        await mockApi().addInteraction(interaction);

        await saveForm(unauthenticatedApplicationData);
      });
    });
  });
});
