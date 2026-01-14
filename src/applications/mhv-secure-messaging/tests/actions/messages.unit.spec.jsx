import {
  mockApiRequest,
  mockFetch,
  mockMultipleApiRequests,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import sinon from 'sinon';
import { expect } from 'chai';
import * as monitoring from '@department-of-veterans-affairs/platform-monitoring/exports';
import { Actions } from '../../util/actionTypes';
import * as Constants from '../../util/constants';
import {
  deleteMessage,
  retrieveMessageThread,
  moveMessageThread,
  sendMessage,
  sendReply,
  markMessageAsReadInThread,
} from '../../actions/messages';
import * as threadResponse from '../e2e/fixtures/thread-response-new-api.json';
import * as messageResponse from '../e2e/fixtures/message-response.json';

describe('messages actions', () => {
  const middlewares = [thunk];
  const mockStore = (initialState = { featureToggles: {} }) =>
    configureStore(middlewares)(initialState);
  let loggerSpy;
  let recordEventStub;

  beforeEach(() => {
    // Mock the global DD_LOGS logger
    loggerSpy = sinon.spy();
    global.window = {
      DD_LOGS: {
        logger: {
          log: loggerSpy,
        },
      },
    };
    recordEventStub = sinon.stub(monitoring, 'recordEvent').callsFake(event => {
      global.window.dataLayer = global.window.dataLayer || [];
      global.window.dataLayer.push(event);
    });
  });

  afterEach(() => {
    recordEventStub.restore();
    delete global.window;
  });
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
        const actions = store.getActions();
        expect(actions).to.deep.include({
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
        // Check that resetRecentRecipient is dispatched after successful send
        expect(actions).to.deep.include({
          type: Actions.AllRecipients.RESET_RECENT,
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
        const actions = store.getActions();
        expect(actions).to.deep.include({
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
        // Ensure resetRecentRecipient is NOT called on error
        expect(actions).to.not.deep.include({
          type: Actions.AllRecipients.RESET_RECENT,
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

  it('should dispatch success alert on sendMessage when suppressAlert is false', async () => {
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
          false,
          false, // suppressAlert = false
        ),
      )
      .then(() => {
        const actions = store.getActions();
        // Verify success alert is dispatched
        expect(actions).to.deep.include({
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

  it('should NOT dispatch success alert on sendMessage when isRxRenewal is true', async () => {
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
          false,
          true, // isRxRenewal = true
        ),
      )
      .then(() => {
        const actions = store.getActions();
        // Verify success alert is NOT dispatched
        expect(actions).to.not.deep.include({
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
        // Verify other actions are still dispatched
        expect(actions).to.deep.include({
          type: Actions.AllRecipients.RESET_RECENT,
        });
      });
  });

  it('should dispatch clearPrescription action on successful sendMessage', async () => {
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
          false,
          false,
          false,
        ),
      )
      .then(() => {
        const actions = store.getActions();

        expect(actions).to.deep.include({
          type: Actions.Prescriptions.CLEAR_PRESCRIPTION,
        });
      });
  });

  it('should NOT dispatch clearPrescription action on failed sendMessage', async () => {
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
          false,
          false,
        ),
      )
      .catch(() => {
        const actions = store.getActions();

        expect(actions).to.not.deep.include({
          type: Actions.Prescriptions.CLEAR_PRESCRIPTION,
        });
      });
  });

  it('should log prescription renewal message when isRxRenewal is true', async () => {
    const store = mockStore();
    mockApiRequest(messageResponse);
    window.dataLayer = [];

    const messageData = {
      category: 'MEDICATIONS',
      body: 'Test body',
      subject: 'Test subject',
    };
    messageData[`${'recipient_id'}`] = '2710520';

    await store.dispatch(
      sendMessage(
        JSON.stringify(messageData),
        false,
        false,
        true, // isRxRenewal = true
      ),
    );

    expect(loggerSpy.calledOnce).to.be.true;
    const call = loggerSpy.getCall(0);
    expect(call.args[0]).to.equal('Prescription Renewal Message Sent');
    expect(call.args[1]).to.deep.equal({
      messageId: messageResponse.data.attributes.messageId,
      recipientId: '2710520',
      category: 'MEDICATIONS',
      hasAttachments: false,
    });
    expect(call.args[2]).to.equal('info');

    const hasApiCall = window.dataLayer?.some(
      e =>
        e?.event === 'api_call' &&
        e?.['api-name'] === 'Rx SM Renewal' &&
        e?.['api-status'] === 'successful',
    );
    expect(hasApiCall).to.be.true;
  });

  it('should log error when prescription renewal message fails', async () => {
    const store = mockStore();
    loggerSpy.reset(); // Reset from previous test
    const rxErrorResponse = {
      errors: [
        {
          code: 'SM999',
          detail: 'Network error',
          status: '500',
        },
      ],
    };
    mockApiRequest(rxErrorResponse, false);
    window.dataLayer = [];
    const messageData = {
      category: 'MEDICATIONS',
      body: 'Test body',
      subject: 'Test subject',
    };
    messageData[`${'recipient_id'}`] = '2710520';
    try {
      await store.dispatch(
        sendMessage(
          JSON.stringify(messageData),
          false,
          false,
          true, // isRxRenewal = true
        ),
      );
    } catch (e) {
      // Expected to throw
    }

    expect(loggerSpy.calledOnce).to.be.true;
    const call = loggerSpy.getCall(0);
    expect(call.args[0]).to.equal('Prescription Renewal Message Send Failed');
    expect(call.args[1].recipientId).to.equal('2710520');
    expect(call.args[1].category).to.equal('MEDICATIONS');
    expect(call.args[1].hasAttachments).to.equal(false);
    // errorCode and errorDetail may vary based on error structure
    expect(call.args[2]).to.equal('error');
    expect(call.args[3]).to.exist;

    const failEvent = window.dataLayer?.find(
      e =>
        e?.event === 'api_call' &&
        e?.['api-name'] === 'Rx SM Renewal' &&
        e?.['api-status'] === 'fail',
    );
    expect(failEvent).to.exist;
  });

  it('should dispatch action on sendReply', async () => {
    const store = mockStore();
    mockApiRequest(messageResponse);
    await store
      .dispatch(
        sendReply({
          replyToId: 1234,
          message: {
            category: 'EDUCATION',
            body: 'Test body',
            subject: 'Test subject',
            recipientId: '2710520',
          },
          attachments: false,
        }),
      )
      .then(() => {
        const actions = store.getActions();
        expect(actions).to.deep.include({
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
        // Check that resetRecentRecipient is dispatched after successful reply
        expect(actions).to.deep.include({
          type: Actions.AllRecipients.RESET_RECENT,
        });
      });
  });

  it('should dispatch error on unsuccessful sendReply', async () => {
    const store = mockStore();
    mockFetch({ ...errorResponse }, false);
    await store
      .dispatch(
        sendReply({
          replyToId: 1234,
          message: {
            category: 'EDUCATION',
            body: 'Test body',
            subject: 'Test subject',
            recipientId: '2710520',
          },
          attachments: true,
        }),
      )
      .catch(() => {
        const actions = store.getActions();
        expect(actions).to.deep.include({
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
        // Ensure resetRecentRecipient is NOT called on error
        expect(actions).to.not.deep.include({
          type: Actions.AllRecipients.RESET_RECENT,
        });
      });
  });

  it('should dispatch error on sendReply when recipient is blocked', async () => {
    const store = mockStore();
    mockFetch({ ...errorBlockedUserResponse }, false);
    await store
      .dispatch(
        sendReply({
          replyToId: 1234,
          message: {
            category: 'EDUCATION',
            body: 'Test body',
            subject: 'Test subject',
            recipientId: '2710520',
          },
          attachments: false,
        }),
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

  describe('markMessageAsReadInThread', () => {
    it('should dispatch GET_MESSAGE_IN_THREAD and RE_FETCH_REQUIRED on success', async () => {
      const store = mockStore();
      mockApiRequest(messageResponse);
      await store.dispatch(markMessageAsReadInThread(7179970));
      const actions = store.getActions();
      expect(actions).to.deep.include({
        type: Actions.Thread.GET_MESSAGE_IN_THREAD,
        response: messageResponse,
      });
      expect(actions).to.deep.include({
        type: Actions.Thread.RE_FETCH_REQUIRED,
        payload: true,
      });
    });

    it('should not dispatch RE_FETCH_REQUIRED on error response', async () => {
      const store = mockStore();
      mockApiRequest({ errors: [{ code: '500', detail: 'Error' }] });
      await store.dispatch(markMessageAsReadInThread(7179970));
      const actions = store.getActions();
      expect(actions).to.not.deep.include({
        type: Actions.Thread.RE_FETCH_REQUIRED,
        payload: true,
      });
    });
  });
});
