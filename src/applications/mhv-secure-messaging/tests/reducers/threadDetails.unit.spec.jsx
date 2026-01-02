import { createStore } from 'redux';
import { expect } from 'chai';
import { threadDetailsReducer } from '../../reducers/threadDetails';
import { Actions } from '../../util/actionTypes';

describe('threadDetails reducer', () => {
  it('should return initial state', () => {
    const state = threadDetailsReducer(undefined, {});
    
    expect(state).to.have.property('acceptInterstitial', false);
    expect(state).to.have.property('drafts');
    expect(state).to.have.property('messages', undefined);
    expect(state).to.have.property('isLoading', false);
    expect(state).to.have.property('cannotReply', false);
    expect(state).to.have.property('draftInProgress');
    expect(state.draftInProgress).to.have.property('messageId', null);
  });

  const mockStore = (initialState) => {
    return createStore(threadDetailsReducer, initialState);
  };

  it('should handle GET_THREAD action', () => {
    const store = mockStore();
    const threadData = {
      messages: [
        { messageId: 1, subject: 'Test Message' },
      ],
      drafts: [],
      threadFolderId: 123,
    };
    
    store.dispatch({
      type: Actions.Thread.GET_THREAD,
      payload: threadData,
    });
    
    const state = store.getState();
    expect(state.messages).to.deep.equal(threadData.messages);
    expect(state.threadFolderId).to.equal(123);
  });

  it('should preserve acceptInterstitial on GET_THREAD', () => {
    const store = mockStore({ acceptInterstitial: true });
    
    store.dispatch({
      type: Actions.Thread.GET_THREAD,
      payload: { messages: [] },
    });
    
    const state = store.getState();
    expect(state.acceptInterstitial).to.equal(true);
  });

  it('should handle DRAFT_SAVE_STARTED action', () => {
    const store = mockStore({
      drafts: [{ messageId: 1, body: 'Test' }],
    });
    
    store.dispatch({
      type: Actions.Thread.DRAFT_SAVE_STARTED,
      payload: { messageId: 1 },
    });
    
    const state = store.getState();
    expect(state.isSaving).to.equal(true);
    expect(state.saveError).to.equal(null);
  });

  it('should handle CREATE_SUCCEEDED action', () => {
    const store = mockStore({ drafts: [] });
    const draftData = {
      messageId: 123,
      body: 'New draft',
      subject: 'Test Subject',
    };
    
    store.dispatch({
      type: Actions.Draft.CREATE_SUCCEEDED,
      response: {
        data: {
          attributes: draftData,
        },
      },
    });
    
    const state = store.getState();
    expect(state.drafts).to.have.lengthOf(1);
    expect(state.drafts[0].messageId).to.equal(123);
    expect(state.isSaving).to.equal(false);
    expect(state.draftInProgress.messageId).to.equal(123);
  });

  it('should handle SAVE_FAILED action', () => {
    const store = mockStore({
      drafts: [{ messageId: 1, body: 'Test' }],
    });
    
    const errorResponse = { status: 500, message: 'Save failed' };
    
    store.dispatch({
      type: Actions.Draft.SAVE_FAILED,
      payload: { messageId: 1 },
      response: errorResponse,
    });
    
    const state = store.getState();
    expect(state.drafts[0].isSaving).to.equal(false);
    expect(state.drafts[0].saveError).to.deep.equal(errorResponse);
  });

  it('should handle RESET_LAST_SAVE_TIME action', () => {
    const store = mockStore({ lastSaveTime: Date.now() });
    
    store.dispatch({
      type: Actions.Thread.RESET_LAST_SAVE_TIME,
    });
    
    const state = store.getState();
    expect(state.lastSaveTime).to.equal(null);
  });

  it('should handle MOVE_REQUEST action', () => {
    const store = mockStore();
    
    store.dispatch({
      type: Actions.Message.MOVE_REQUEST,
    });
    
    const state = store.getState();
    expect(state.isLoading).to.equal(true);
  });

  it('should handle MOVE_FAILED action', () => {
    const store = mockStore({ isLoading: true });
    
    store.dispatch({
      type: Actions.Message.MOVE_FAILED,
    });
    
    const state = store.getState();
    expect(state.isLoading).to.equal(false);
  });

  it('should handle CLEAR_THREAD action', () => {
    const store = mockStore({
      messages: [{ messageId: 1 }],
      drafts: [{ messageId: 2 }],
      threadFolderId: 123,
      acceptInterstitial: true,
    });
    
    store.dispatch({
      type: Actions.Thread.CLEAR_THREAD,
    });
    
    const state = store.getState();
    expect(state.messages).to.equal(undefined);
    expect(state.drafts).to.deep.equal([]);
    expect(state.acceptInterstitial).to.equal(true);
  });

  it('should handle CANNOT_REPLY_ALERT action', () => {
    const store = mockStore();
    
    store.dispatch({
      type: Actions.Thread.CANNOT_REPLY_ALERT,
      payload: true,
    });
    
    const state = store.getState();
    expect(state.cannotReply).to.equal(true);
  });

  it('should handle UPDATE_DRAFT_IN_PROGRESS action', () => {
    const store = mockStore();
    const draftUpdate = {
      body: 'Updated body',
      subject: 'Updated subject',
    };
    
    store.dispatch({
      type: Actions.Draft.UPDATE_DRAFT_IN_PROGRESS,
      payload: draftUpdate,
    });
    
    const state = store.getState();
    expect(state.draftInProgress.body).to.equal('Updated body');
    expect(state.draftInProgress.subject).to.equal('Updated subject');
  });

  it('should handle CLEAR_DRAFT_IN_PROGRESS action', () => {
    const store = mockStore({
      draftInProgress: {
        messageId: 123,
        body: 'Test',
        subject: 'Test Subject',
      },
    });
    
    store.dispatch({
      type: Actions.Draft.CLEAR_DRAFT_IN_PROGRESS,
    });
    
    const state = store.getState();
    expect(state.draftInProgress.messageId).to.equal(null);
    expect(state.draftInProgress.body).to.equal(null);
    expect(state.draftInProgress.subject).to.equal(null);
  });

  it('should handle SET_ACCEPT_INTERSTITIAL action', () => {
    const store = mockStore();
    
    store.dispatch({
      type: Actions.Draft.SET_ACCEPT_INTERSTITIAL,
      payload: true,
    });
    
    const state = store.getState();
    expect(state.acceptInterstitial).to.equal(true);
  });

  it('should handle UPDATE_DRAFT_IN_THREAD action', () => {
    const store = mockStore({
      drafts: [{ messageId: 1, body: 'Old' }],
    });
    
    store.dispatch({
      type: Actions.Thread.UPDATE_DRAFT_IN_THREAD,
      payload: { messageId: 1, body: 'New' },
    });
    
    const state = store.getState();
    expect(state.isSaving).to.equal(false);
    expect(state.lastSaveTime).to.be.a('number');
  });

  it('should handle unknown action type', () => {
    const store = mockStore();
    const initialState = store.getState();
    
    store.dispatch({
      type: 'UNKNOWN_ACTION',
      payload: {},
    });
    
    const state = store.getState();
    expect(state).to.deep.equal(initialState);
  });
});
