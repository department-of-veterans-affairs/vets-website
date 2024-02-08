import {
  mockApiRequest,
  mockFetch,
  mockMultipleApiRequests,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { Actions } from '../../util/actionTypes';
import * as Constants from '../../util/constants';
import {
  deleteMessage,
  retrieveMessageThread,
  moveMessageThread,
  sendMessage,
  sendReply,
} from '../../actions/messages';
import * as threadResponse from '../e2e/fixtures/thread-response-new-api.json';
import * as messageResponse from '../e2e/fixtures/message-response.json';

describe('messages actions', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const errorResponse = {
    errors: [
      {
        title: 'Service unavailable',
        detail: 'Backend Service Outage',
        code: '503',
        status: '503',
      },
    ],
  };
  const errorBlockedUserResponse = {
    errors: [
      {
        code: Constants.Errors.Code.BLOCKED_USER,
        status: Constants.Errors.Code.BLOCKED_USER,
      },
    ],
  };
  const threadNotFoundResponse = {
    errors: [
      {
        title: 'Record not found',
        detail: 'Entity requested could not be found',
        code: 'SM115',
        status: '404',
      },
    ],
  };

  it('should dispatch action on retrieveMessageThread', async () => {
    const store = mockStore();
    const req1 = { shouldResolve: true, response: threadResponse };
    const req2 = { shouldResolve: true, response: messageResponse };
    mockMultipleApiRequests([req1, req2]);
    await store.dispatch(retrieveMessageThread('1234')).then(() => {
      expect(store.getActions()[1]).to.include({
        type: Actions.Thread.GET_THREAD,
      });
    });
  });

  it('should dispatch action on retrieveMessageThread with a draft', async () => {
    const store = mockStore();
    const resWithDraft = JSON.parse(JSON.stringify(threadResponse));
    resWithDraft.data[0].attributes.draftDate = new Date();

    const draftResponse = {
      data: {
        id: resWithDraft.data[0].id,
        type: 'messages',
        attributes: {
          ...resWithDraft.data[0].attributes,
        },
        relationships: {
          attachments: {
            data: [],
          },
        },
      },
    };

    const req1 = { shouldResolve: true, response: resWithDraft };
    const req2 = { shouldResolve: true, response: messageResponse };
    const req3 = { shouldResolve: true, response: draftResponse };
    mockMultipleApiRequests([req1, req2, req3]);

    await store.dispatch(retrieveMessageThread('1234')).then(() => {
      expect(store.getActions()[1]).to.include({
        type: Actions.Thread.GET_THREAD,
      });
    });
  });

  it('should dispatch action on retrieveMessageThread with only sent messages', async () => {
    const store = mockStore();
    const threads = threadResponse.data.map(t => {
      return {
        ...t,
        attributes: {
          ...t.attributes,
          recipientName: t.attributes.triageGroupName,
        },
      };
    });
    const threadResponseSent = { ...threadResponse, data: threads };

    const req1 = { shouldResolve: true, response: threadResponseSent };
    const req2 = { shouldResolve: true, response: messageResponse };
    mockMultipleApiRequests([req1, req2]);
    await store.dispatch(retrieveMessageThread('1234')).then(() => {
      expect(store.getActions()[1]).to.include({
        type: Actions.Thread.GET_THREAD,
      });
    });
  });

  it('should dispatch error on retrieveMessageThread no records found', async () => {
    const store = mockStore();

    mockFetch({ ...threadNotFoundResponse }, false);
    await store.dispatch(retrieveMessageThread(1234)).catch(() => {
      expect(store.getActions()).to.deep.include({
        type: Actions.Thread.CLEAR_THREAD,
      });
      expect(store.getActions()).to.deep.include({
        type: Actions.Alerts.ADD_ALERT,
        payload: {
          alertType: 'error',
          header: '',
          content: Constants.Alerts.Thread.THREAD_NOT_FOUND_ERROR,
          className: undefined,
          link: undefined,
          title: undefined,
          response: undefined,
        },
      });
    });
  });

  it('should dispatch error on retrieveMessageThread', async () => {
    const store = mockStore();
    mockFetch({ ...errorResponse }, false);
    await store.dispatch(retrieveMessageThread(1234)).catch(() => {
      expect(store.getActions()).to.deep.include({
        type: Actions.Thread.CLEAR_THREAD,
      });
      expect(store.getActions()).to.deep.include({
        type: Actions.Alerts.ADD_ALERT,
        payload: {
          alertType: 'error',
          header: '',
          content: errorResponse.errors[0].detail,
          className: undefined,
          link: undefined,
          title: undefined,
          response: undefined,
        },
      });
    });
  });

  it('should dispatch action on deleteMessage', async () => {
    const store = mockStore();
    mockApiRequest({ method: 'PATCH', status: 204 });
    await store.dispatch(deleteMessage(1234)).then(() => {
      expect(store.getActions()).to.deep.include({
        type: Actions.Message.DELETE_SUCCESS,
      });
    });
  });

  it('should dispatch an error on unsuccessful deleteMessage', async () => {
    const store = mockStore();
    mockFetch({ ...errorResponse }, false);
    await store.dispatch(deleteMessage(1234)).catch(() => {
      expect(store.getActions()).to.deep.include({
        type: Actions.Alerts.ADD_ALERT,
        payload: {
          alertType: 'error',
          header: '',
          content: Constants.Alerts.Message.DELETE_MESSAGE_ERROR,
          className: undefined,
          link: undefined,
          title: undefined,
          response: undefined,
        },
      });
    });
  });

  it('should dispatch action on moveMessageThread', async () => {
    const store = mockStore();
    mockApiRequest({ status: 204, method: 'PATCH' });
    await store.dispatch(moveMessageThread(1234, 0)).then(() => {
      expect(store.getActions()).to.deep.include({
        type: Actions.Message.MOVE_REQUEST,
      });
    });
  });

  it('should dispatch an error on unsuccessful moveMessageThread', async () => {
    const store = mockStore();
    mockFetch({ ...errorResponse }, false);
    await store.dispatch(moveMessageThread(1234, 0)).catch(() => {
      expect(store.getActions()).to.deep.include({
        type: Actions.Message.MOVE_FAILED,
      });
      expect(store.getActions()).to.deep.include({
        type: Actions.Alerts.ADD_ALERT,
        payload: {
          alertType: 'error',
          header: '',
          content: Constants.Alerts.Message.MOVE_MESSAGE_THREAD_ERROR,
          className: undefined,
          link: undefined,
          title: undefined,
          response: undefined,
        },
      });
    });
  });

  it('should dispatch action on sendMessage', async () => {
    const store = mockStore();
    mockApiRequest(messageResponse);
    await store
      .dispatch(
        sendMessage(
          {
            category: 'EDUCATION',
            body: 'Test body',
            subject: 'Test subject',
            recipientId: '2710520',
          },
          true,
        ),
      )
      .then(() => {
        expect(store.getActions()).to.deep.include({
          type: Actions.Alerts.ADD_ALERT,
          payload: {
            alertType: 'success',
            header: '',
            content: Constants.Alerts.Message.SEND_MESSAGE_SUCCESS,
            className: undefined,
            link: undefined,
            title: undefined,
            response: undefined,
          },
        });
      });
  });

  it('should dispatch error on unsuccessful sendMessage', async () => {
    const store = mockStore();
    mockFetch({ ...errorResponse }, false);
    await store
      .dispatch(
        sendMessage(
          {
            category: 'EDUCATION',
            body: 'Test body',
            subject: 'Test subject',
            recipientId: '2710520',
          },
          false,
        ),
      )
      .catch(() => {
        expect(store.getActions()).to.deep.include({
          type: Actions.Alerts.ADD_ALERT,
          payload: {
            alertType: 'error',
            header: '',
            content: Constants.Alerts.Message.SEND_MESSAGE_ERROR,
            className: undefined,
            link: undefined,
            title: undefined,
            response: undefined,
          },
        });
      });
  });

  it('should dispatch error on sendMessage when recipient is blocked', async () => {
    const store = mockStore();
    mockFetch({ ...errorBlockedUserResponse }, false);
    await store
      .dispatch(
        sendMessage(
          {
            category: 'EDUCATION',
            body: 'Test body',
            subject: 'Test subject',
            recipientId: '2710520',
          },
          false,
        ),
      )
      .catch(() => {
        expect(store.getActions()).to.deep.include({
          type: Actions.Alerts.ADD_ALERT,
          payload: {
            alertType: 'error',
            header: '',
            content: Constants.Alerts.Message.BLOCKED_MESSAGE_ERROR,
            className: undefined,
            link: undefined,
            title: undefined,
            response: undefined,
          },
        });
      });
  });

  it('should dispatch action on sendReply', async () => {
    const store = mockStore();
    mockApiRequest(messageResponse);
    await store
      .dispatch(
        sendReply(
          1234,
          {
            category: 'EDUCATION',
            body: 'Test body',
            subject: 'Test subject',
            recipientId: '2710520',
          },
          false,
        ),
      )
      .then(() => {
        expect(store.getActions()).to.deep.include({
          type: Actions.Alerts.ADD_ALERT,
          payload: {
            alertType: 'success',
            header: '',
            content: Constants.Alerts.Message.SEND_MESSAGE_SUCCESS,
            className: undefined,
            link: undefined,
            title: undefined,
            response: undefined,
          },
        });
      });
  });

  it('should dispatch error on unsuccessful sendReply', async () => {
    const store = mockStore();
    mockFetch({ ...errorResponse }, false);
    await store
      .dispatch(
        sendReply(
          1234,
          {
            category: 'EDUCATION',
            body: 'Test body',
            subject: 'Test subject',
            recipientId: '2710520',
          },
          true,
        ),
      )
      .catch(() => {
        expect(store.getActions()).to.deep.include({
          type: Actions.Alerts.ADD_ALERT,
          payload: {
            alertType: 'error',
            header: '',
            content: Constants.Alerts.Message.SEND_MESSAGE_ERROR,
            className: undefined,
            link: undefined,
            title: undefined,
            response: undefined,
          },
        });
      });
  });

  it('should dispatch error on sendReply when recipient is blocked', async () => {
    const store = mockStore();
    mockFetch({ ...errorBlockedUserResponse }, false);
    await store
      .dispatch(
        sendReply(
          1234,
          {
            category: 'EDUCATION',
            body: 'Test body',
            subject: 'Test subject',
            recipientId: '2710520',
          },
          false,
        ),
      )
      .catch(() => {
        expect(store.getActions()).to.deep.include({
          type: Actions.Alerts.ADD_ALERT,
          payload: {
            alertType: 'error',
            header: '',
            content: Constants.Alerts.Message.BLOCKED_MESSAGE_ERROR,
            className: undefined,
            link: undefined,
            title: undefined,
            response: undefined,
          },
        });
      });
  });
});
