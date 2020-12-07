import contractTest from 'platform/testing/contract';
import sinon from 'sinon';
import { expect } from 'chai';
import {
  decimal,
  eachLike,
  integer,
  string,
} from '@pact-foundation/pact/dsl/matchers';

// GET request
// user can be logged in
// get request on /coronavirus-vaccination/apply includes user data (see below)

// user can not be logged in
// get request on /coronavirus-vaccination/apply does include any user data

// user data:
// first name
// last name
// date of birth: month, day, year
// ssn (not required)
// email address
// phone
// vaccination preference

contractTest('Request a COVID-19 vaccination', 'VA.gov API', mockApi => {
  describe('GET coronavirus-vaccination/apply', () => {
    // the following includes some example code for now...
    it('returns user data when user is logged in', async () => {
      await mockApi().addInteraction({
        state: 'logged in user with messages',
        uponReceiving: 'a GET request',
        withRequest: {
          method: 'GET',
          path: '/v0/ask/inquiries',
          headers: {},
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': term({
              matcher: '^application/json',
              generate: 'application/json',
            }),
          },
          body: like({
            inquiries: eachLike({
              subject: 'Eyeglasses',
              confirmationNumber: '000-011',
              status: 'RESOLVED',
              creationTimestamp: iso8601DateTime(),
              lastActiveTimestamp: iso8601DateTime(),
              links: {
                thread: {
                  href: '/v1/user/{:user-id}/inquiry/000-011',
                },
              },
            }),
          }),
        },
      });

      const dispatch = sinon.stub();

      await fetchInquiries()(dispatch);
    });

    // the following includes some example code for now...
    it("doesn't return user data when user isn't logged in", async () => {
      await mockApi().addInteraction({
        state: 'logged in user with messages',
        uponReceiving: 'a GET request',
        withRequest: {
          method: 'GET',
          path: '/v0/ask/inquiries',
          headers: {},
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': term({
              matcher: '^application/json',
              generate: 'application/json',
            }),
          },
          body: like({
            inquiries: eachLike({
              subject: 'Eyeglasses',
              confirmationNumber: '000-011',
              status: 'RESOLVED',
              creationTimestamp: iso8601DateTime(),
              lastActiveTimestamp: iso8601DateTime(),
              links: {
                thread: {
                  href: '/v1/user/{:user-id}/inquiry/000-011',
                },
              },
            }),
          }),
        },
      });

      const dispatch = sinon.stub();

      await fetchInquiries()(dispatch);
    });
  });

// POST request
// what will the response include?

  describe('POST coronavirus-vaccination/apply', () => { // url will need to be updated
    // the following includes some example code for now...
    it('Success case: submit valid form will return a 201 Created HTTP response', async () => {
      generalQuestionData.data.veteranStatus.veteranStatus = 'general';
      delete generalQuestionData.data['view:email'];

      await mockApi().addInteraction({
        state: 'General Question flow with minimal required data',
        uponReceiving: 'a POST request',
        withRequest: {
          method: 'POST',
          path: '/v0/ask/asks',
          headers: {
            'X-Key-Inflection': 'camel',
            'Content-Type': 'application/json',
          },
          body: {
            inquiry: {
              form: JSON.stringify(generalQuestionData.data),
            },
          },
        },
        willRespondWith: {
          status: 201,
          headers: {
            'Content-Type': term({
              matcher: '^application/json',
              generate: 'application/json',
            }),
          },
          body: like({
            confirmationNumber: '0000-0000-0000',
            dateSubmitted: '10-20-2020',
          }),
        },
      });
      const form = generalQuestionData;

      const dispatch = sinon.stub();

      await submitForm(formConfig, form)(dispatch);
    });
  });
});
