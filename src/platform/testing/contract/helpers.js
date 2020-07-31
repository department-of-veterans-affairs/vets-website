import { Matchers } from '@pact-foundation/pact';
import { expect } from 'chai';
import sinon from 'sinon';

const { integer, iso8601DateTimeWithMillis } = Matchers;

import { saveFormApi } from 'platform/forms/save-in-progress/api';
import { submitForm } from 'platform/forms-system/src/js/actions';

export const testFormSubmit = async (formConfig, formData) => {
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

      expect(response.data.type).to.eql('in_progress_forms');
      expect(response.data.attributes.formId).to.eql(formId);
    });

    /*
    it('responds with failure', async () => {
    });
    */
  });
};
