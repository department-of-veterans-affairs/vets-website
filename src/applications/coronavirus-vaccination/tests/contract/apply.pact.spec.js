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
  // describe('GET coronavirus-vaccination/apply', () => {
  //   context('when a user is logged in', () => {
  //     it('returns user data', async () => {
  //       await mockApi().addInteraction({
  //         state: 'logged in user form data', // finalize state
  //         uponReceiving: 'a GET request',
  //         withRequest: {
  //           method: 'GET',
  //           path: '/v0/ask/inquiries', // get path
  //           headers: {}, //
  //         },
  //         willRespondWith: {
  //           status: 200,
  //           headers: {
  //             'Content-Type': term({
  //               matcher: '^application/json',
  //               generate: 'application/json',
  //             }),
  //           },
  //           body: like({
  //             inquiries: eachLike({
  //               subject: 'Eyeglasses',
  //               confirmationNumber: '000-011',
  //               status: 'RESOLVED',
  //               creationTimestamp: iso8601DateTime(),
  //               lastActiveTimestamp: iso8601DateTime(),
  //               links: {
  //                 thread: {
  //                   href: '/v1/user/{:user-id}/inquiry/000-011',
  //                 },
  //               },
  //             }),
  //           }),
  //         },
  //       });

  //       const dispatch = sinon.stub();

  //       await fetchInquiries()(dispatch);
  //     });
  //   });
  // });

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
