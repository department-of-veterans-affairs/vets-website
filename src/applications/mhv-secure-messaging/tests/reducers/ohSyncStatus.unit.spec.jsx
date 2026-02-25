import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { fetchOHSyncStatus } from '../../actions/ohSyncStatus';
import { ohSyncStatusReducer } from '../../reducers/ohSyncStatus';

describe('ohSyncStatus reducer', () => {
  const mockStore = (initialState = {}) => {
    return createStore(
      ohSyncStatusReducer,
      initialState,
      applyMiddleware(thunk),
    );
  };

  const mockOHSyncStatusResponse = {
    data: {
      id: '1',
      type: 'oh_sync_status',
      attributes: {
        status: 'FINISHED',
        syncComplete: true,
        error: null,
      },
    },
  };

  it('should dispatch action on fetchOHSyncStatus success', async () => {
    const store = mockStore();
    mockApiRequest(mockOHSyncStatusResponse);
    await store.dispatch(fetchOHSyncStatus());
    expect(store.getState()).to.deep.equal({
      data: {
        status: 'FINISHED',
        syncComplete: true,
        error: null,
      },
      error: undefined,
    });
  });

  it('should dispatch action on fetchOHSyncStatus error', async () => {
    const store = mockStore();
    mockApiRequest({}, false);
    await store.dispatch(fetchOHSyncStatus());
    expect(store.getState()).to.deep.equal({
      data: null,
      error: true,
    });
  });
});
