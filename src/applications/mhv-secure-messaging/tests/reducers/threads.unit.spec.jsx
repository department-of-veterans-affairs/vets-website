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

import {
  clearListOfThreads,
  getListOfThreads,
  resetThreadSortOrder,
  setThreadPage,
} from '../../actions/threads';
import { threadSortingOptions } from '../../util/constants';

describe('threads reducer', () => {
  const mockStore = (initialState = {}) => {
    return createStore(threadsReducer, initialState, applyMiddleware(thunk));
  };

  it('should dispatch isLoading value when retrieving a thread', async () => {
    const store = mockStore();
    mockApiRequest(inboxThreadResponse);
    store.dispatch(getListOfThreads(0, 10, 1));
    expect(store.getState()).to.deep.equal({
      isLoading: true,
    });
  });

  it('should dispatch a thread list', async () => {
    const store = mockStore();
    mockApiRequest(inboxThreadResponse);

    await store.dispatch(getListOfThreads(0, 10, 1));

    expect(store.getState()).to.deep.equal({
      threadList: inboxThreadResponse.data.map(thread => {
        const thrdAttr = thread.attributes;
        return { ...thrdAttr };
      }),
      isLoading: false,
    });
  });

  it('should dispatch an empty array when no threads returned', async () => {
    const store = mockStore();
    mockFetch(inboxNoThreadsResponse, false);

    await store.dispatch(getListOfThreads(0, 10, 1));
    expect(store.getState()).to.deep.equal({
      threadList: [],
      isLoading: false,
    });
  });

  it('should dispatch an action on clearListOfThreads', async () => {
    const store = mockStore();
    await store.dispatch(clearListOfThreads());

    expect(store.getState()).to.deep.equal({
      threadList: undefined,
    });
  });

  it('should dispatch an action on setThreadPage', async () => {
    const store = mockStore();
    const page = 5;
    await store.dispatch(setThreadPage(page));

    expect(store.getState()).to.deep.equal({
      threadSort: { page },
    });
  });

  it('should dispatch an action on resetThreadSortOrder', async () => {
    const store = mockStore();
    await store.dispatch(resetThreadSortOrder());

    expect(store.getState()).to.deep.equal({
      threadSort: {
        value: threadSortingOptions.SENT_DATE_DESCENDING.value,
        folderId: undefined,
        page: 1,
      },
    });
  });
});
