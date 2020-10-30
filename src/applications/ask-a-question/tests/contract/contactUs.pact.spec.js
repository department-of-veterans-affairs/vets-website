import sinon from 'sinon';
import { like, term } from '@pact-foundation/pact/dsl/matchers';

import contractTest from 'platform/testing/contract';
import { submitForm } from 'platform/forms-system/src/js/actions';

import formConfig from '../../form/form';
import minimalData from '../cypress/fixtures/data/minimal-test.json';

contractTest('Contact Us', 'VA.gov API', mockApi => {
  describe('POST /ask/asks', () => {
    it('responds with 200 when submitting form', async () => {
      minimalData.data.veteranStatus.veteranStatus = 'general';
      delete minimalData.data['view:email'];

      await mockApi().addInteraction({
        state: 'minimum required data',
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
              form: JSON.stringify(minimalData.data),
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
      const form = minimalData;

      const dispatch = sinon.stub();

      await submitForm(formConfig, form)(dispatch);
    });
  });
});
