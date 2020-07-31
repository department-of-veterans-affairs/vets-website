import { Matchers } from '@pact-foundation/pact';
import { expect } from 'chai';
import sinon from 'sinon';

import { fetchInProgressForm } from 'platform/forms/save-in-progress/actions';

import {
  removeFormApi,
  saveFormApi,
} from 'platform/forms/save-in-progress/api';

import { submitForm } from 'platform/forms-system/src/js/actions';
import { createFormPageList } from 'platform/forms-system/src/js/helpers';

const { integer, iso8601DateTimeWithMillis, like } = Matchers;

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

  describe('GET /v0/in_progress_forms', () => {
    it('responds with 200', async () => {
      await mockApi.addInteraction({
        state: 'a saved form exists',
        uponReceiving: 'a request to get an in-progress form',
        withRequest: {
          method: 'GET',
          path: `/v0/in_progress_forms/${formId}`,
          headers: {
            'X-Key-Inflection': 'camel',
          },
        },
        willRespondWith: {
          status: 200,
          body: {
            formData: like(formData.data || formData),
            metadata: {
              lastUpdated: integer(1596032190),
              returnUrl,
              savedAt,
              expiresAt: integer(1601216190),
              version,
            },
          },
        },
      });

      const dispatch = sinon.spy();
      const pages = createFormPageList(formConfig);
      const getState = sinon.stub().returns({
        form: {
          trackingPrefix,
          pages,
        },
      });

      await fetchInProgressForm(formId)(dispatch, getState);

      const [firstAction] = dispatch.firstCall.args;
      expect(firstAction.type).to.eq('SET_FETCH_FORM_PENDING');

      const [secondAction] = dispatch.secondCall.args;
      expect(secondAction.type).to.eq('SET_IN_PROGRESS_FORM');
    });
  });

  describe('DELETE /v0/in_progress_forms', () => {
    it('responds with 200', async () => {
      await mockApi.addInteraction({
        state: 'a saved form exists',
        uponReceiving: 'a request to delete an in-progress form',
        withRequest: {
          method: 'DELETE',
          path: `/v0/in_progress_forms/${formId}`,
          headers: {
            'X-Key-Inflection': 'camel',
          },
        },
        willRespondWith: {
          status: 200,
        },
      });

      await removeFormApi(formId);
    });
  });

  describe('PUT /v0/in_progress_forms', () => {
    it('responds with 200', async () => {
      await mockApi.addInteraction({
        state: 'user is authenticated',
        uponReceiving: 'a request to save an in-progress form',
        withRequest: {
          method: 'PUT',
          path: `/v0/in_progress_forms/${formId}`,
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
                metadata: {
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
      });

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
  });
};
