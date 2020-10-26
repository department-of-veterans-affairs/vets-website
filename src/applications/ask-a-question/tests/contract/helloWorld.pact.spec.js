import sinon from 'sinon';
import { like, term } from '@pact-foundation/pact/dsl/matchers';

import contractTest from 'platform/testing/contract';
import { submitForm } from 'platform/forms-system/src/js/actions';

import formConfig from '../../form/form';

contractTest('Ask a Question', 'VA.gov API', mockApi => {
  describe('POST /ask/asks', () => {
    it('responds with 200 when submitting form', async () => {
      await mockApi().addInteraction({
        state: 'there are no service history records',
        uponReceiving: 'a GET request',
        withRequest: {
          method: 'POST',
          path: '/v0/ask/asks',
          headers: {
            'X-Key-Inflection': 'camel',
            'Content-Type': 'application/json',
          },
          body: {
            inquiry: {
              form: '{"veteranStatus":{"veteranStatus":""}}',
            },
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
            confirmationNumber: '0000-0000-0000',
            dateSubmitted: '10-20-2020',
          }),
        },
      });
      const form = { data: { veteranStatus: { veteranStatus: '' } } };

      const dispatch = sinon.stub();

      await submitForm(formConfig, form)(dispatch);
    });
  });
});
