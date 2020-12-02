import sinon from 'sinon';
import { term, iso8601DateTime } from '@pact-foundation/pact/dsl/matchers';
import { fetchInquiries } from '../../actions/';

import contractTest from 'platform/testing/contract';

contractTest('My Messages', 'VA.gov API', mockApi => {
  describe('GET /messages/inquiries', () => {
    it('returns a list of messages for user', async () => {
      await mockApi().addInteraction({
        state: 'Logged In User With Messages',
        uponReceiving: 'a GET request',
        withRequest: {
          method: 'GET',
          path: '/v0/messages/inquiries',
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
            inquiries: [
              {
                subject: 'Eyeglasses',
                confirmationNumber: '000-011',
                status: 'RESOLVED',
                creationTimestamp: iso8601DateTime(),
                lastActiveTimestamp: iso8601DateTime(),
                _links: {
                  thread: {
                    href: '/v1/user/{:user-id}/inquiry/000-011',
                  },
                },
              },
            ],
          },
        },
      });

      const dispatch = sinon.stub();

      await fetchInquiries()(dispatch);
    });
  });
});
