import contractTest from 'platform/testing/contract';
import {
  setupFormSubmitTest,
  testSaveInProgress,
} from 'platform/testing/contract/helpers';

import formConfig from '../config/form';
import formData from './schema/maximal-test.json';

contractTest('HCA', 'VA.gov API', mockApi => {
  describe('POST /v0/health_care_applications', () => {
    context('without attachments', () => {
      it('responds with success', async () => {
        const {
          requestBody,
          responseBody,
          testFormSubmit,
        } = setupFormSubmitTest(formConfig, formData);

        await mockApi.addInteraction({
          state: 'enrollment service is up',
          uponReceiving: 'a request to submit a health care application',
          withRequest: {
            method: 'POST',
            path: '/v0/health_care_applications',
            headers: {
              'Content-Type': 'application/json',
              'X-Key-Inflection': 'camel',
            },
            body: requestBody,
          },
          willRespondWith: {
            status: 200,
            body: responseBody,
          },
        });

        await testFormSubmit();
      });
    });

    // context('with attachments', () => {});
  });

  testSaveInProgress(mockApi, formConfig, formData);
});
