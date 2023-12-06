import {
  mockApiRequest,
  mockMultipleApiRequests,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import { createStore, applyMiddleware } from 'redux';
import { expect } from 'chai';
import thunk from 'redux-thunk';
import { Actions } from '../../util/actionTypes';
import { messageDetailsReducer } from '../../reducers/messageDetails';
import threadResponse from '../e2e/fixtures/thread-response-new-api.json';
import messageWithAttachmentResponse from '../e2e/fixtures/message-response-withattachments.json';
import {
  markMessageAsReadInThread,
  moveMessageThread,
  retrieveMessageThread,
} from '../../actions/messages';
import messageHistoryReducer from '../fixtures/message-history-mock-reducer.json';

describe('messageDetails reducer', () => {
  const mockStore = (initialState = {}) => {
    return createStore(
      messageDetailsReducer,
      initialState,
      applyMiddleware(thunk),
    );
  };

  it("should dispatch a message when a thread doesn't contain drafts", async () => {
    const store = mockStore();

    const req1 = { shouldResolve: true, response: threadResponse };
    const req2 = {
      shouldResolve: true,
      response: messageWithAttachmentResponse,
    };
    mockMultipleApiRequests([req1, req2]);
    await store.dispatch(retrieveMessageThread('1234'));
    const state = store.getState();
    const attachment = messageWithAttachmentResponse.included[0];
    const obj = {
      attachments: [
        {
          id: attachment.id,
          link: attachment.links.download,
          ...attachment.attributes,
        },
      ],
      replyToName: threadResponse.data[0].attributes.senderName,
      threadFolderId: threadResponse.data[0].attributes.folderId.toString(),
      ...threadResponse.data[0].attributes,
      ...messageWithAttachmentResponse.data.attributes,
    };
    expect(state.message).to.deep.equal(obj);
  });

  it('in a thread that with no drafts draft, it should mark a message in messageHistory as read', async () => {
    const { messageHistory } = messageHistoryReducer;
    const message = {
      replyToName: 'Test User',
      threadFolderId: 0,
      replyToMessageId: messageWithAttachmentResponse.data.attributes.messageId,
      ...threadResponse.data[0].attributes,
      ...messageWithAttachmentResponse.data.attributes,
    };
    const initialstate = { message, messageHistory };
    const readMessage = messageHistory[0];
    const mockResponse = {
      data: {
        ...messageWithAttachmentResponse.data,
        attributes: {
          ...messageWithAttachmentResponse.data.attributes,
          ...readMessage,
        },
      },
      included: messageWithAttachmentResponse.included,
    };
    const attachment = messageWithAttachmentResponse.included[0];
    mockApiRequest(mockResponse);
    const store = mockStore(initialstate);
    await store.dispatch(markMessageAsReadInThread(readMessage.messageId));
    expect(store.getState().messageHistory[0]).to.deep.equal({
      attachments: [
        {
          id: attachment.id,
          link: attachment.links.download,
          ...attachment.attributes,
        },
      ],
      preloaded: true,
      ...mockResponse.data.attributes,
    });
  });

  it('dispatches an action on failed moveMessageThread', async () => {
    const store = mockStore();
    mockApiRequest({ method: 'PATCH', status: 204 }, false);
    store.dispatch(moveMessageThread(1234, 0)).catch(() => {
      expect(store.getState()).to.deep.equal({ isLoading: false });
    });
    expect(store.getState()).to.deep.equal({ isLoading: true });
  });

  it('dispatches thread print option to a reducer value', async () => {
    const store = mockStore();
    const val = 'all';
    await store.dispatch({
      type: Actions.Message.SET_THREAD_PRINT_OPTION,
      payload: val,
    });
    expect(store.getState().printOption).to.equal(val);
  });

  it('dispatches thread view count to a reducer value', async () => {
    const store = mockStore();
    const val = 10;
    await store.dispatch({
      type: Actions.Message.SET_THREAD_VIEW_COUNT,
      payload: val,
    });
    expect(store.getState().threadViewCount).to.equal(val);
  });

  it('dispatches cannotReply to a reducer value', async () => {
    const store = mockStore();
    const val = true;
    await store.dispatch({
      type: Actions.Message.CANNOT_REPLY_ALERT,
      payload: val,
    });
    expect(store.getState().cannotReply).to.equal(val);
  });
});
