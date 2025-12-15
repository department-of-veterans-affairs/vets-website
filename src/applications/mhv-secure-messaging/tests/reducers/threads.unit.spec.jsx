import {
  mockApiRequest,
  mockFetch,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import { createStore, applyMiddleware } from 'redux';
import { expect } from 'chai';
import thunk from 'redux-thunk';
import { threadsReducer } from '../../reducers/threads';
import inboxThreadResponse from '../fixtures/mock-api-responses/inbox-threads-response.json';
import inboxNoThreadsResponse from '../fixtures/mock-api-responses/inbox-no-threads-response.json';
import { Actions } from '../../util/actionTypes';

import {
  clearListOfThreads,
  getListOfThreads,
  resetThreadSortOrder,
  setThreadPage,
} from '../../actions/threads';
import { threadSortingOptions } from '../../util/constants';

describe('threads reducer', () => {
  const mockStore = (initialState = { featureToggles: {} }) => {
    return createStore(threadsReducer, initialState, applyMiddleware(thunk));
  };

  it('should dispatch isLoading value when retrieving a thread', async () => {
    const store = mockStore();
    mockApiRequest(inboxThreadResponse);
    store.dispatch(getListOfThreads(0, 10, 1));
    expect(store.getState()).to.deep.equal({
      featureToggles: {},
      isLoading: true,
    });
  });

  it('should dispatch a thread list', async () => {
    const store = mockStore();
    mockApiRequest(inboxThreadResponse);

    await store.dispatch(getListOfThreads(0, 10, 1));

    expect(store.getState()).to.deep.equal({
      featureToggles: {},
      threadList: inboxThreadResponse.data.map(thread => {
        const thrdAttr = thread.attributes;
        return { ...thrdAttr };
      }),
      isLoading: false,
      refetchRequired: false,
    });
  });

  it('should dispatch an empty array when no threads returned', async () => {
    const store = mockStore();
    mockFetch(inboxNoThreadsResponse, false);

    await store.dispatch(getListOfThreads(0, 10, 1));
    expect(store.getState()).to.deep.equal({
      featureToggles: {},
      threadList: [],
      isLoading: false,
    });
  });

  it('should dispatch an action on clearListOfThreads', async () => {
    const store = mockStore();
    await store.dispatch(clearListOfThreads());

    expect(store.getState()).to.deep.equal({
      featureToggles: {},
      threadList: undefined,
    });
  });

  it('should dispatch an action on setThreadPage', async () => {
    const store = mockStore();
    const page = 5;
    await store.dispatch(setThreadPage(page));

    expect(store.getState()).to.deep.equal({
      featureToggles: {},
      threadSort: { page },
    });
  });

  it('should dispatch an action on resetThreadSortOrder', async () => {
    const store = mockStore();
    await store.dispatch(resetThreadSortOrder());

    expect(store.getState()).to.deep.equal({
      featureToggles: {},
      threadSort: {
        value: threadSortingOptions.SENT_DATE_DESCENDING.value,
        folderId: undefined,
        page: 1,
      },
    });
  });

  it('should handle ERROR_LOADING_LIST action', () => {
    const store = mockStore();
    const errorResponse = { errors: [{ title: 'Some error', code: 500 }] };
    store.dispatch({
      type: Actions.Thread.ERROR_LOADING_LIST,
      response: { ...errorResponse },
    });
    expect(store.getState()).to.deep.equal({
      featureToggles: {},
      threadList: undefined,
      isLoading: false,
      hasError: true,
      error: errorResponse.errors,
    });
  });
});
