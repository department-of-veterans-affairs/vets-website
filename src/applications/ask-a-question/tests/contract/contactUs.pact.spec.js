import sinon from 'sinon';
import { like, term } from '@pact-foundation/pact/dsl/matchers';

import contractTest from 'platform/testing/contract';
import { submitForm } from 'platform/forms-system/src/js/actions';

import formConfig from '../../form/form';
import generalQuestionData from '../cypress/fixtures/data/general-question.json';

contractTest('Contact Us', 'VA.gov API', mockApi => {
  describe('POST /ask/asks', () => {
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
