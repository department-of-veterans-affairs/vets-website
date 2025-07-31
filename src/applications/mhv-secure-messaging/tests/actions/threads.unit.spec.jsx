import {
  mockApiRequest,
  mockFetch,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { Actions } from '../../util/actionTypes';
import * as Constants from '../../util/constants';
import {
  clearListOfThreads,
  getListOfThreads,
  resetThreadSortOrder,
  setThreadPage,
} from '../../actions/threads';
import * as threadResponse from '../fixtures/message-thread-response.json';

describe('threads actions', () => {
  const middlewares = [thunk];
  const mockStore = (initialState = { featureToggles: {} }) =>
    configureStore(middlewares)(initialState);

  const noThreadsResponse = {
    errors: [
      {
        title: 'Operation failed',
        detail: 'No messages in the requested folder',
        code: 'VA900',
        status: '400',
      },
    ],
  };

  it('should dispatch response on getListOfThreads action', async () => {
    mockApiRequest(threadResponse);
    const store = mockStore();
    await store.dispatch(getListOfThreads(0, 10, 1));
    expect(store.getActions()).to.deep.include({
      type: Actions.Thread.GET_LIST,
      response: threadResponse,
    });
  });

  it('should dispatch empty list on getListOfThreads action when no threads', async () => {
    mockFetch(noThreadsResponse, false);
    const store = mockStore();
    await store.dispatch(getListOfThreads(-1, 20, 5));
    expect(store.getActions()).to.deep.include({
      type: Actions.Thread.GET_EMPTY_LIST,
      response: [],
    });
  });

  it('should dispatch error on unsuccessful getListOfThreads action if error object contains details', async () => {
    const mockError = {
      errors: [
        {
          title: 'Operation failed',
          detail: 'MHV Backend Service Outage',
          code: 'VA900',
          status: '503',
        },
      ],
    };
    mockFetch(mockError, false);
    const store = mockStore();
    await store.dispatch(getListOfThreads());
    expect(store.getActions()).to.deep.include({
      type: Actions.Alerts.ADD_ALERT,
      payload: {
        alertType: Constants.ALERT_TYPE_ERROR,
        header: '',
        content: `${Constants.Alerts.Thread.GET_THREAD_ERROR} ${
          mockError.errors[0].detail
        }`,
        className: undefined,
        link: undefined,
        title: undefined,
        response: undefined,
      },
    });
  });

  it('should dispatch error on unsuccessful getListOfThreads action', async () => {
    mockApiRequest(noThreadsResponse, false);
    const store = mockStore();
    await store.dispatch(getListOfThreads(0, 10, 1));
    expect(store.getActions()).to.deep.include({
      type: Actions.Alerts.ADD_ALERT,
      payload: {
        alertType: Constants.ALERT_TYPE_ERROR,
        header: '',
        content: Constants.Alerts.Thread.GET_THREAD_ERROR,
        className: undefined,
        link: undefined,
        title: undefined,
        response: undefined,
      },
    });
  });

  it('should dispatch actions on setThreadPage, resetThreadSortOrder and clearListOfThreads', async () => {
    const store = mockStore();
    const page = 2;
    await store.dispatch(setThreadPage(page));
    expect(store.getActions()).to.deep.include({
      type: Actions.Thread.SET_PAGE,
      payload: page,
    });

    await store.dispatch(resetThreadSortOrder());
    expect(store.getActions()).to.deep.include({
      type: Actions.Thread.RESET_SORT_ORDER,
    });

    await store.dispatch(clearListOfThreads());
    expect(store.getActions()).to.deep.include({
      type: Actions.Thread.CLEAR_LIST,
    });
  });
});
