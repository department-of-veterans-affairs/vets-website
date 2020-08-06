import { Matchers } from '@pact-foundation/pact';

import contractTest from 'platform/testing/contract';

import {
  testFormSubmit,
  testSaveInProgress,
} from 'platform/testing/contract/helpers';

import formConfig from '../config/form';
import formData from './schema/maximal-test.json';

const { integer, iso8601DateTimeWithMillis, term } = Matchers;

contractTest('HCA', 'VA.gov API', mockApi => {
  describe('POST /v0/health_care_applications', () => {
    context('without attachments', () => {
      it('responds with success', async () => {
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
            body: JSON.parse(
              formConfig.transformForSubmit(formConfig, formData),
            ),
          },
          willRespondWith: {
            status: 200,
            body: {
              data: {
                id: integer(12345),
                type: 'health_care_applications',
                attributes: {
                  state: term({
                    matcher: 'success|error|failed|pending',
                    generate: 'pending',
                  }),
                  formSubmissionId: integer(67890),
                  timestamp: iso8601DateTimeWithMillis(
                    '2020-07-29T14:16:30.527Z',
                  ),
                },
              },
            },
          },
        });

        await testFormSubmit(formConfig, formData);
      });
    });

    // context('with attachments', () => {});
  });

  testSaveInProgress(mockApi, formConfig, formData);
});
