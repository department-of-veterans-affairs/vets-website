import { Matchers } from '@pact-foundation/pact';

import contractTest from 'platform/testing/contract';
import {
  setupFormSubmitTest,
  setupInProgressFormTest,
} from 'platform/testing/contract/helpers';

import formConfig from '../config/form';
import testData from './schema/maximal-test.json';

const { boolean, integer, iso8601DateTimeWithMillis } = Matchers;

contractTest('HCA', 'VA.gov API', mockApi => {
  describe('POST /v0/health_care_applications', () => {
    context('without attachments', () => {
      it('responds with success', async () => {
        const [requestBody, testFormSubmit] = setupFormSubmitTest(
          formConfig,
          testData,
        );

        const responseBody = {
          success: true,
          formSubmissionId: integer(3806115661),
          timestamp: iso8601DateTimeWithMillis(),
        };

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

  describe('PUT /v0/in_progress_forms', () => {
    it('responds with success', async () => {
      const [requestBody, testSaveInProgress] = setupInProgressFormTest(
        formConfig,
        testData,
      );

      const responseBody = {
        data: {
          attributes: {
            formData: testData,
            metaData: {
              prefill: boolean(true),
              returnUrl: integer('/veteran-information'),
              version: integer(formConfig.version),
            },
          },
        },
      };

      await mockApi.addInteraction({
        state: 'enrollment service is up',
        uponReceiving:
          'a request to save an in-progress health care application',
        withRequest: {
          method: 'PUT',
          path: `/v0/in_progress_forms/${formConfig.formId}`,
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

      await testSaveInProgress();
    });
  });
});
