import contractTest from 'platform/testing/contract';
// import sinon from 'sinon';
// import { expect } from 'chai';
// import {
//   decimal,
//   eachLike,
//   integer,
//   like,
//   string,
//   term,
// } from '@pact-foundation/pact/dsl/matchers';
// import useSubmitForm from '../../hooks/useSubmitForm';
import authenticatedApplicationData from '../cypress/fixtures/data/authenticated-coronavirus-vaccination-application.json';
import unauthenticatedApplicationData from '../cypress/fixtures/data/unauthenticated-coronavirus-vaccination-application.json';

contractTest('coronavirus-vaccination', 'VA.gov API', mockApi => {
  describe('POST /registration', () => {
    context('when a user is logged in', () => {
      it('Success case: submit valid form will return a 201 Created HTTP response', async () => {
        await mockApi().addInteraction({
          state: 'authenticated user data with contact preference',
          uponReceiving: 'a POST request',
          withRequest: {
            method: 'POST',
            path: '/covid_vaccine/v0/registration',
            headers: {
              'Content-Type': 'application/json',
            },
            body: {
              inquiry: {
                form: JSON.stringify(authenticatedApplicationData),
              },
            },
          },
          willRespondWith: {
            status: 201,
            // headers: {
            //   'Content-Type': term({
            //     matcher: '^application/json',
            //     generate: 'application/json',
            //   }),
            // },
            // body: like({}),
          },
        });

        // const [_, submitToApi] = useSubmitForm();
        // submitToApi(authenticatedApplicationData)
        // SUBMIT THE FORM!
      });
    });
  });

  describe('POST /registration/unauthenticated', () => {
    context('when a user is not logged in', () => {
      it('Success case: submit valid form will return a 201 Created HTTP response', async () => {
        await mockApi().addInteraction({
          state: 'authenticated user data with contact preference',
          uponReceiving: 'a POST request',
          withRequest: {
            method: 'POST',
            path: '/covid_vaccine/v0/registration/unauthenticated',
            headers: {
              'Content-Type': 'application/json',
            },
            body: {
              inquiry: {
                form: JSON.stringify(unauthenticatedApplicationData),
              },
            },
          },
          willRespondWith: {
            status: 201,
            // headers: {
            //   'Content-Type': term({
            //     matcher: '^application/json',
            //     generate: 'application/json',
            //   }),
            // },
            // body: like({}),
          },
        });

        // const [_, submitToApi] = useSubmitForm();
        // submitToApi(unauthenticatedApplicationData)
      });
    });
  });
});
