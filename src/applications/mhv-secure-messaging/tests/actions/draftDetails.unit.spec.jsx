import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import {
  deleteDraft,
  saveDraft,
  saveReplyDraft,
} from '../../actions/draftDetails';
import * as saveDraftResponse from '../e2e/fixtures/draftsResponse/drafts-single-message-response.json';
import { Actions } from '../../util/actionTypes';

describe('draftDetails actions', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const {
    body,
    subject,
    category,
    recipientId,
    messageId,
  } = saveDraftResponse.data.attributes;
  const requestMessageData = { body, subject, category, recipientId };

  /* --- sendSaveDraft action --- */
  it('should call dispatch on sendSaveDraft "Save new draft" success', async () => {
    mockApiRequest(saveDraftResponse);
    const store = mockStore({ sm: {} });
    store.dispatch(saveDraft(requestMessageData, 'manual')).then(() => {
      expect(store.getActions()).to.deep.include({
        type: Actions.Thread.DRAFT_SAVE_STARTED,
      });
      expect(store.getActions()).to.deep.include({
        type: Actions.Draft.CREATE_SUCCEEDED,
        response: saveDraftResponse.data,
      });
    });
  });

  it('should call dispatch on sendSaveDraft "Update draft" success', async () => {
    mockApiRequest({ ok: true, status: 204 });
    const store = mockStore({ sm: {} });
    const timeNow = Date.now();

    await store
      .dispatch(saveDraft(requestMessageData, 'manual', messageId))
      .then(() => {
        expect(store.getActions()).to.deep.include({
          type: Actions.Thread.DRAFT_SAVE_STARTED,
        });
        const action = store.getActions()[1];
        action.payload.draftDate = timeNow;
        expect(store.getActions()[1]).to.deep.include(
          {
            type: Actions.Thread.UPDATE_DRAFT_IN_THREAD,
            payload: {
              messageId,
              draftDate: timeNow,
              ...requestMessageData,
            },
          },
          'excluding payload.draftDate',
        );
      });
  });

  it('should resolve error on call dispatch on sendSaveDraft error', async () => {
    const mockResponse = { errors: [{ title: 'Error' }] };
    mockApiRequest(mockResponse);
    const store = mockStore({ sm: {} });
    store
      .dispatch(saveDraft(requestMessageData, 'manual', messageId))
      .then(() => {
        expect(store.getActions()).to.deep.include({
          type: Actions.Draft.SAVE_STARTED,
        });
        expect(store.getActions()).to.deep.include({
          type: Actions.Draft.SAVE_FAILED,
          response: mockResponse.errors[0],
        });
      });
  });

  it('should call dispatch on "auto" sendSaveDraft "Save new draft" success', async () => {
    mockApiRequest(saveDraftResponse);
    const store = mockStore({ sm: {} });
    await store
      .dispatch(saveDraft({ body, subject, category, recipientId }, 'auto'))
      .then(() => {
        expect(store.getActions()).to.deep.include({
          type: Actions.Thread.DRAFT_SAVE_STARTED,
        });
        expect(store.getActions()).to.deep.include({
          type: Actions.Draft.CREATE_SUCCEEDED,
          response: saveDraftResponse,
        });
      });
  });
  /* --- END sendSaveDraft action --- */

  /* --- saveReplyDraft action --- */
  it('should call dispatch on saveReplyDraft "Save reply draft" success', async () => {
    mockApiRequest(saveDraftResponse);
    const store = mockStore({ sm: {} });
    await store
      .dispatch(saveReplyDraft('1234', requestMessageData, 'manual'))
      .then(() => {
        expect(store.getActions()).to.deep.include({
          type: Actions.Thread.DRAFT_SAVE_STARTED,
        });
        expect(store.getActions()).to.deep.include({
          type: Actions.Draft.CREATE_SUCCEEDED,
          response: saveDraftResponse,
        });
      });
  });

  it('should call dispatch on saveReplyDraft "Update draft" success', async () => {
    mockApiRequest({ ok: true, status: 204 });
    const store = mockStore({ sm: {} });

    store
      .dispatch(saveReplyDraft('1234', requestMessageData, 'manual', messageId))
      .then(() => {
        expect(store.getActions()).to.deep.include({
          type: Actions.Draft.SAVE_STARTED,
        });
        expect(store.getActions()).to.deep.include({
          type: Actions.Draft.CREATE_SUCCEEDED,
          response: requestMessageData,
        });
      });
  });

  it('should resolve error on call dispatch on saveReplyDraft error', async () => {
    const mockResponse = { errors: [{ title: 'Error' }] };
    mockApiRequest(mockResponse);
    const store = mockStore({ sm: {} });
    store
      .dispatch(saveReplyDraft('1234', requestMessageData, 'manual', messageId))
      .then(() => {
        expect(store.getActions()).to.deep.include({
          type: Actions.Draft.SAVE_STARTED,
        });
        expect(store.getActions()).to.deep.include({
          type: Actions.Draft.SAVE_FAILED,
          response: mockResponse.errors[0],
        });
      });
  });

  it('should call dispatch on "auto" saveReplyDraft "Save reply draft" success', async () => {
    mockApiRequest(saveDraftResponse);
    const store = mockStore({ sm: {} });
    await store
      .dispatch(saveReplyDraft('1234', requestMessageData, 'auto'))
      .then(() => {
        expect(store.getActions()).to.deep.include({
          type: Actions.Thread.DRAFT_SAVE_STARTED,
        });
        expect(store.getActions()).to.deep.include({
          type: Actions.Draft.CREATE_SUCCEEDED,
          response: saveDraftResponse,
        });
      });
  });
  /* --- END saveReplyDraft action --- */

  it('should call dispatch on deleteDraft success', async () => {
    mockApiRequest({ method: 'DELETE', ok: true, status: 204 });
    const store = mockStore({ sm: {} });
    await store.dispatch(deleteDraft('1234')).then(() => {
      expect(store.getActions()).to.deep.contain({
        type: Actions.Alerts.ADD_ALERT,
        payload: {
          alertType: 'success',
          header: '',
          content: 'Draft was successfully deleted.',
          className: undefined,
          link: undefined,
          title: undefined,
          response: undefined,
        },
      });
    });
  });
});
