import contractTest from 'platform/testing/contract';
import { like, string, term } from '@pact-foundation/pact/dsl/matchers';
import { retrievePreviouslySubmittedForm, saveForm } from '../../api/';
import authenticatedApplicationData from '../cypress/fixtures/data/authenticated-coronavirus-vaccination-application.json';
import unauthenticatedApplicationData from '../cypress/fixtures/data/unauthenticated-coronavirus-vaccination-application.json';

contractTest('Coronavirus Vaccination', 'VA.gov API', mockApi => {
  describe('GET /registration', () => {
    it('request for saved submission that exists returns a 200 OK HTTP response and the registration data', async () => {
      const interaction = {
        state: 'retrieves previously saved submission data for user',
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
              attributes: {
                createdAt: like('2020-12-14T13:23:52.929Z'),
                vaccineInterest: like('INTERESTED'),
                zipCode: like('10001'),
                zipCodeDetails: like('Yes'),
                phone: like('1112223333'),
                email: like('test@example.com'),
                firstName: like('JAMES'),
                lastName: like('BECK'),
                birthDate: like('1989-11-11'),
              },
            },
          },
        },
      };

      await mockApi().addInteraction(interaction);

      await retrievePreviouslySubmittedForm();
    });

    // ERROR:
    it('request for saved registration that does not exist returns a 404 OK HTTP response and errors', async () => {
      const interaction = {
        state:
          'does not retrieve perviously saved submission data for user becase it does not exist',
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
            data: {
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
        },
      };

      await mockApi().addInteraction(interaction);

      await retrievePreviouslySubmittedForm();
    });
  });

  describe('POST /registration', () => {
    it('authenticated success case: submit valid registration returns a 201 Created HTTP response', async () => {
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
              id: string('BC79619E54A14BFF0D1607952232618112202'),
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

    it('unauthenticated success case: submit valid registration will return a 201 Created HTTP response', async () => {
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
              id: string('BC79619E54A14BFF0D1607952232618112202'),
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
