import { Matchers } from '@pact-foundation/pact';

import contractTest from 'platform/testing/contract';

import {
  testFormSubmit,
  testSaveInProgress,
} from 'platform/testing/contract/helpers';

import formConfig from '../config/form';
import minimalTestData from './schema/minimal-test.json';
import maximalTestData from './schema/maximal-test.json';

const { boolean, integer, iso8601DateTimeWithMillis, string, term } = Matchers;

contractTest('HCA', 'VA.gov API', mockApi => {
  describe('POST /v0/health_care_applications', () => {
    context('unauthenticated with email', () => {
      it('responds with success', async () => {
        await mockApi.addInteraction({
          state: 'enrollment service is up',
          uponReceiving:
            'a request to submit a health care application with email',
          withRequest: {
            method: 'POST',
            path: '/v0/health_care_applications',
            headers: {
              'Content-Type': 'application/json',
              'X-Key-Inflection': 'camel',
            },
            body: JSON.parse(
              formConfig.transformForSubmit(formConfig, maximalTestData),
            ),
          },
          willRespondWith: {
            status: 200,
            body: {
              data: {
                id: string('12345'),
                type: 'health_care_applications',
                attributes: {
                  state: term({
                    matcher: 'success|error|failed|pending',
                    generate: 'pending',
                  }),
                  formSubmissionId: null,
                  timestamp: null,
                },
              },
            },
          },
        });

        await testFormSubmit(formConfig, maximalTestData);
      });
    });

    context('unauthenticated without email', () => {
      it('responds with success', async () => {
        await mockApi.addInteraction({
          state: 'enrollment service is up',
          uponReceiving:
            'a request to submit a health care application without email',
          withRequest: {
            method: 'POST',
            path: '/v0/health_care_applications',
            headers: {
              'Content-Type': 'application/json',
              'X-Key-Inflection': 'camel',
            },
            body: JSON.parse(
              formConfig.transformForSubmit(formConfig, minimalTestData),
            ),
          },
          willRespondWith: {
            status: 200,
            body: {
              success: boolean(true),
              formSubmissionId: integer(67890),
              timestamp: iso8601DateTimeWithMillis('2020-07-29T14:16:30.527Z'),
            },
          },
        });

        await testFormSubmit(formConfig, minimalTestData);
      });
    });
  });

  testSaveInProgress(mockApi, formConfig, maximalTestData);
});
