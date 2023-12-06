import {
  mockApiRequest,
  mockMultipleApiRequests,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import { createStore, applyMiddleware } from 'redux';
import { expect } from 'chai';
import thunk from 'redux-thunk';
import { draftDetailsReducer } from '../../reducers/draftDetails';
import threadResponse from '../e2e/fixtures/thread-response-new-api.json';
import messageResponse from '../e2e/fixtures/message-response.json';
import {
  markMessageAsReadInThread,
  retrieveMessageThread,
} from '../../actions/messages';
import { saveDraft } from '../../actions/draftDetails';
import draftMessageHistoryReducer from '../fixtures/draft-message-history-mock-reducer.json';

describe('draftDetailsReducer reducer', () => {
  const mockStore = (initialState = {}) => {
    return createStore(
      draftDetailsReducer,
      initialState,
      applyMiddleware(thunk),
    );
  };

  it('should dispatch a draft when a thread contains a draft', async () => {
    const store = mockStore();
    const resWithDraft = JSON.parse(JSON.stringify(threadResponse));
    resWithDraft.data[0].attributes.draftDate = new Date();
    const req1 = { shouldResolve: true, response: resWithDraft };
    const req2 = { shouldResolve: true, response: messageResponse };
    mockMultipleApiRequests([req1, req2]);
    await store.dispatch(retrieveMessageThread('1234'));
    const state = store.getState();
    expect(state.draftMessage).to.contain({
      ...resWithDraft.data[0].attributes,
      ...messageResponse.data.attributes,
    });
    expect(state.replyToMessageId).to.equal(
      messageResponse.data.attributes.messageId,
    );
  });

  it('should dispatch a draft on autosave', async () => {
    const store = mockStore();
    const draftData = {
      body: messageResponse.data.attributes.body,
      category: messageResponse.data.attributes.category,
      recipientId: messageResponse.data.attributes.recipientId,
      subject: messageResponse.data.attributes.subject,
    };
    mockApiRequest(messageResponse);
    await store.dispatch(saveDraft(draftData, 'auto'));
    expect(store.getState().draftMessage).to.deep.equal({
      ...messageResponse.data.attributes,
    });
  });

  it('should update a draft on save', async () => {
    const initialState = {
      draftMessage: {
        replyToName: 'Test User',
        threadFolderId: 0,
        replyToMessageId: messageResponse.data.attributes.messageId,
        ...threadResponse.data[0].attributes,
        ...messageResponse.data.attributes,
      },
    };
    const store = mockStore(initialState);
    const draftData = {
      recipientId: 2710520,
      category: 'OTHER',
      subject: 'TEsting reducers',
      body: 'TEsting reducersss',
    };
    mockApiRequest({ method: 'PUT', status: 204, ok: true });
    await store.dispatch(saveDraft(draftData, 'manual', 1234));

    // using deep include because of sync issue with lastSaveTime attribute
    expect(store.getState()).to.deep.include({
      isSaving: false,
      saveError: null,
      draftMessage: {
        ...initialState.draftMessage,
        ...draftData,
      },
    });
  });

  it('in a thread that contains a draft, it should mark a message in draftMessageHistory as read in ', async () => {
    const { draftMessageHistory } = draftMessageHistoryReducer;
    const draftMessage = {
      replyToName: 'Test User',
      threadFolderId: 0,
      replyToMessageId: messageResponse.data.attributes.messageId,
      ...threadResponse.data[0].attributes,
      ...messageResponse.data.attributes,
    };
    const initialstate = { draftMessage, draftMessageHistory };
    const readMessage = draftMessageHistory[0];
    const mockResponse = {
      data: {
        ...messageResponse.data,
        attributes: { ...messageResponse.data.attributes, ...readMessage },
      },
    };
    mockApiRequest(mockResponse);
    const store = mockStore(initialstate);
    await store.dispatch(
      markMessageAsReadInThread(readMessage.messageId, true),
    );
    expect(store.getState().draftMessageHistory[0]).to.deep.equal({
      attachments: undefined,
      draftDate: undefined,
      folderId: undefined,
      preloaded: true,
      threadId: undefined,
      toDate: undefined,
      ...mockResponse.data.attributes,
    });
  });
});
