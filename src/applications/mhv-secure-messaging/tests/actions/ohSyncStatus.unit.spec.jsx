import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { Actions } from '../../util/actionTypes';
import { fetchOHSyncStatus } from '../../actions/ohSyncStatus';

describe('ohSyncStatus actions', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

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
    expect(store.getActions()).to.deep.include({
      type: Actions.OHSyncStatus.GET,
      response: mockOHSyncStatusResponse,
    });
  });

  it('should dispatch action on fetchOHSyncStatus error', async () => {
    const store = mockStore();
    mockApiRequest({}, false);
    await store.dispatch(fetchOHSyncStatus());
    expect(store.getActions()).to.deep.include({
      type: Actions.OHSyncStatus.GET_ERROR,
    });
  });
});
