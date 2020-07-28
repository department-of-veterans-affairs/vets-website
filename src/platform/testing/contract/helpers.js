import { Matchers } from '@pact-foundation/pact';
import { expect } from 'chai';
import sinon from 'sinon';

const { boolean, integer, iso8601DateTimeWithMillis, string } = Matchers;

import { saveFormApi } from 'platform/forms/save-in-progress/api';
import { submitForm } from 'platform/forms-system/src/js/actions';

export const setupFormSubmitTest = (formConfig, formData) => {
  // Actual request expects string, but interaction request expects object.
  const requestBody = JSON.parse(
    formConfig.transformForSubmit(formConfig, formData),
  );

  const responseBody = {
    success: true,
    formSubmissionId: integer(3806115661),
    timestamp: iso8601DateTimeWithMillis(),
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
    expect(secondAction.response.success).to.be.true;
  };

  return {
    requestBody,
    responseBody,
    testFormSubmit,
  };
};

export const testSaveInProgress = (mockApi, formConfig, formData) => {
  const returnUrl = '/form-url/review-and-submit';
  const savedAt = Date.now();
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
              attributes: {
                formData,
                metaData: {
                  prefill: boolean(true),
                  returnUrl: string('/veteran-information'),
                  version: integer(formConfig.version),
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
