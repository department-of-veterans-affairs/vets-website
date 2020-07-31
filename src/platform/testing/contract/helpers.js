import { Matchers } from '@pact-foundation/pact';
import { expect } from 'chai';
import sinon from 'sinon';

const { integer, iso8601DateTimeWithMillis, term } = Matchers;

import { saveFormApi } from 'platform/forms/save-in-progress/api';
import { submitForm } from 'platform/forms-system/src/js/actions';

export const setupFormSubmitTest = (formConfig, formData) => {
  // Actual request expects string, but interaction request expects object.
  const requestBody = JSON.parse(
    formConfig.transformForSubmit(formConfig, formData),
  );

  const responseBody = {
    id: integer(12345),
    type: 'health_care_applications',
    attributes: {
      state: term({
        matcher: 'success|error|failed|pending',
        generate: 'pending',
      }),
      formSubmissionId: integer(67890),
      timestamp: iso8601DateTimeWithMillis('2020-07-29T14:16:30.527Z'),
    },
  };

  const testFormSubmit = async () => {
    const dispatch = sinon.spy();
    await submitForm(formConfig, formData)(dispatch);

    const [firstAction] = dispatch.firstCall.args;
    expect(firstAction.type).to.eq('SET_SUBMISSION');
    expect(firstAction.field).to.eq('status');
    expect(firstAction.value).to.eq('submitPending');

    const [secondAction] = dispatch.secondCall.args;
    expect(secondAction.type).to.eq('SET_SUBMITTED');
    expect(secondAction.response.attributes.state).to.eq('pending');
  };

  return {
    requestBody,
    responseBody,
    testFormSubmit,
  };
};

export const testSaveInProgress = (mockApi, formConfig, formData) => {
  const returnUrl = '/form-url/review-and-submit';
  const savedAt = 1595954803670;
  const { formId, trackingPrefix, version } = formConfig;

  describe('PUT /v0/in_progress_forms', () => {
    it('responds with success', async () => {
      const interaction = {
        uponReceiving: 'a request to save an in-progress form',
        withRequest: {
          method: 'PUT',
          path: `/v0/in_progress_forms/${formConfig.formId}`,
          headers: {
            'Content-Type': 'application/json',
            'X-Key-Inflection': 'camel',
          },
          body: {
            formData,
            metadata: { returnUrl, savedAt, version },
          },
        },
        willRespondWith: {
          status: 200,
          body: {
            data: {
              id: integer(123),
              type: 'in_progress_forms',
              attributes: {
                formId,
                createdAt: iso8601DateTimeWithMillis(
                  '2020-07-29T14:16:30.510Z',
                ),
                updatedAt: iso8601DateTimeWithMillis(
                  '2020-07-29T14:16:30.527Z',
                ),
                metaData: {
                  lastUpdated: integer(1596032190),
                  returnUrl,
                  savedAt,
                  expiresAt: integer(1601216190),
                  version,
                },
              },
            },
          },
        },
      };

      await mockApi.addInteraction(interaction);

      const response = await saveFormApi(
        formId,
        formData,
        version,
        returnUrl,
        savedAt,
        trackingPrefix,
      );

      expect(response.data.attributes.formData).to.eql(formData);
    });

    /*
    it('responds with failure', async () => {
    });
    */
  });
};
