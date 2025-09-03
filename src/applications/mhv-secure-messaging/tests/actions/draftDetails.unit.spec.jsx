import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import {
  deleteDraft,
  saveDraft,
  saveReplyDraft,
} from '../../actions/draftDetails';
import saveDraftResponse from '../e2e/fixtures/draftsResponse/drafts-single-message-response.json';
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
    await store.dispatch(saveDraft(requestMessageData, 'manual')).then(() => {
      const actions = store.getActions();
      expect(actions).to.deep.include({
        type: Actions.Thread.DRAFT_SAVE_STARTED,
      });
      expect(actions).to.deep.include({
        type: Actions.Draft.CREATE_SUCCEEDED,
        response: {
          data: saveDraftResponse.data,
        },
      });
      // Check that resetRecentRecipient is dispatched after successful draft save
      expect(actions).to.deep.include({
        type: Actions.AllRecipients.RESET_RECENT,
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
        const actions = store.getActions();
        expect(actions).to.deep.include({
          type: Actions.Thread.DRAFT_SAVE_STARTED,
        });
        const action = actions[1];
        action.payload.draftDate = timeNow;
        expect(actions[1]).to.deep.include(
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
        // For update draft (response.ok), resetRecentRecipient should NOT be called
        expect(actions).to.not.deep.include({
          type: Actions.AllRecipients.RESET_RECENT,
        });
      });
  });

  it('should resolve error on call dispatch on sendSaveDraft error', async () => {
    const mockResponse = { errors: [{ title: 'Error' }] };
    mockApiRequest(mockResponse);
    const store = mockStore({ sm: {} });
    await store
      .dispatch(saveDraft(requestMessageData, 'manual', messageId))
      .then(() => {
        const actions = store.getActions();
        expect(actions).to.deep.include({
          type: Actions.Thread.DRAFT_SAVE_STARTED,
        });
        expect(actions).to.deep.include({
          type: Actions.Draft.SAVE_FAILED,
          response: mockResponse.errors[0],
        });
        // For error case, resetRecentRecipient should NOT be called
        expect(actions).to.not.deep.include({
          type: Actions.AllRecipients.RESET_RECENT,
        });
      });
  });

  it('should call dispatch on "auto" sendSaveDraft "Save new draft" success', async () => {
    mockApiRequest(saveDraftResponse);
    const store = mockStore({ sm: {} });
    await store
      .dispatch(saveDraft({ body, subject, category, recipientId }, 'auto'))
      .then(() => {
        const actions = store.getActions();
        expect(actions).to.deep.include({
          type: Actions.Thread.DRAFT_SAVE_STARTED,
        });
        expect(actions).to.deep.include({
          type: Actions.Draft.CREATE_SUCCEEDED,
          response: {
            data: saveDraftResponse.data,
          },
        });
        // Check that resetRecentRecipient is dispatched after successful auto draft save
        expect(actions).to.deep.include({
          type: Actions.AllRecipients.RESET_RECENT,
        });
      });
  });
  /* --- END sendSaveDraft action --- */

  /* --- saveReplyDraft action --- */
  it('should call dispatch on saveReplyDraft "Save reply draft" success', async () => {
    mockApiRequest(saveDraftResponse);
    const store = mockStore({ sm: {} });
    await store
      .dispatch(
        saveReplyDraft(
          1234,
          requestMessageData,
          'manual',
          saveDraftResponse.data.id,
        ),
      )
      .then(() => {
        const actions = store.getActions();
        expect(actions).to.deep.include({
          type: Actions.Thread.DRAFT_SAVE_STARTED,
          payload: { messageId: saveDraftResponse.data.id },
        });
        expect(actions).to.deep.include({
          type: Actions.Draft.CREATE_SUCCEEDED,
          response: {
            data: saveDraftResponse.data,
          },
        });
        // Check that resetRecentRecipient is dispatched after successful reply draft save
        expect(actions).to.deep.include({
          type: Actions.AllRecipients.RESET_RECENT,
        });
      });
  });

  it('should call dispatch on saveReplyDraft "Update draft" success', async () => {
    mockApiRequest({ ok: true, status: 204 });
    const store = mockStore({ sm: {} });

    await store
      .dispatch(saveReplyDraft('1234', requestMessageData, 'manual', messageId))
      .then(() => {
        const actions = store.getActions();
        expect(actions).to.deep.include({
          type: Actions.Thread.DRAFT_SAVE_STARTED,
          payload: { messageId },
        });
        expect(actions).to.deep.include({
          type: Actions.Thread.UPDATE_DRAFT_IN_THREAD,
          payload: { messageId, draftDate: Date.now(), ...requestMessageData },
        });
        // For update reply draft (response.ok), resetRecentRecipient should NOT be called
        expect(actions).to.not.deep.include({
          type: Actions.AllRecipients.RESET_RECENT,
        });
      });
  });

  it('should resolve error on call dispatch on saveReplyDraft error', async () => {
    const mockResponse = { errors: [{ title: 'Error' }] };
    mockApiRequest(mockResponse);
    const store = mockStore({ sm: {} });
    try {
      await store.dispatch(
        saveReplyDraft('1234', requestMessageData, 'manual', messageId),
      );
    } catch (error) {
      const actions = store.getActions();
      expect(actions).to.deep.include({
        type: Actions.Thread.DRAFT_SAVE_STARTED,
        payload: { messageId },
      });
      expect(actions).to.deep.include({
        type: Actions.Draft.SAVE_FAILED,
        payload: { messageId },
        response: mockResponse.errors[0],
      });
      // For error case, resetRecentRecipient should NOT be called
      expect(actions).to.not.deep.include({
        type: Actions.AllRecipients.RESET_RECENT,
      });
    }
  });

  it('should call dispatch on "auto" saveReplyDraft "Save reply draft" success', async () => {
    mockApiRequest(saveDraftResponse);
    const store = mockStore({ sm: {} });
    await store
      .dispatch(
        saveReplyDraft(
          1234,
          requestMessageData,
          'auto',
          saveDraftResponse.data.id,
        ),
      )
      .then(() => {
        const actions = store.getActions();
        expect(actions).to.deep.include({
          type: Actions.Thread.DRAFT_SAVE_STARTED,
          payload: { messageId: saveDraftResponse.data.id },
        });
        expect(actions).to.deep.include({
          type: Actions.Draft.CREATE_SUCCEEDED,
          response: {
            data: saveDraftResponse.data,
          },
        });
        // Check that resetRecentRecipient is dispatched after successful auto reply draft save
        expect(actions).to.deep.include({
          type: Actions.AllRecipients.RESET_RECENT,
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
