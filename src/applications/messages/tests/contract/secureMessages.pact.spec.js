import sinon from 'sinon';
import { expect } from 'chai';
import {
  term,
  like,
  eachLike,
  iso8601DateTime,
} from '@pact-foundation/pact/dsl/matchers';
import { fetchInquiries } from '../../actions/';

import contractTest from 'platform/testing/contract';

contractTest('My Messages', 'VA.gov API', mockApi => {
  describe.skip('GET /ask/inquiries', () => {
    it('returns a list of messages for user', async () => {
      await mockApi().addInteraction({
        state: 'logged in user with messages',
        uponReceiving: 'a GET request',
        withRequest: {
          method: 'GET',
          path: '/v0/ask/inquiries',
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

    it('returns 401 if user is not logged in', async () => {
      await mockApi().addInteraction({
        state: 'not logged in',
        uponReceiving: 'a GET request',
        withRequest: {
          method: 'GET',
          path: '/v0/ask/inquiries',
          headers: {
            'X-Key-Inflection': 'camel',
          },
        },
        willRespondWith: {
          status: 401,
        },
      });

      const dispatch = sinon.stub();

      await expect(fetchInquiries()(dispatch)).to.be.rejected;
    });
  });
});
