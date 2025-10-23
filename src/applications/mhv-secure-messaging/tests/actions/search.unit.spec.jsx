import {
  mockApiRequest,
  mockFetch,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { Actions } from '../../util/actionTypes';
import {
  runAdvancedSearch,
  findByKeyword,
  setSearchSort,
  setSearchPage,
  clearSearchResults,
} from '../../actions/search';
import searchResponse from '../fixtures/searchResponses/search-COVID-results.json';
import inbox from '../fixtures/folder-inbox-metadata.json';

describe('search actions', () => {
  const middlewares = [thunk];
  const mockStore = (initialState = { featureToggles: {} }) =>
    configureStore(middlewares)(initialState);
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
  const customErrorResponse = {
    errors: [
      {
        code: 'SM99',
        status: '502',
      },
    ],
  };

  it('should dispatch action on runAdvancedSearch', async () => {
    const store = mockStore();
    mockApiRequest(searchResponse);
    const keyword = 'test';
    const query = { category: 'covid', queryData: {} };
    const matches = findByKeyword(keyword, searchResponse.data);
    await store.dispatch(runAdvancedSearch(inbox, query, keyword));
    expect(store.getActions()).to.deep.include({ type: Actions.Search.START });
    expect(store.getActions()).to.deep.include({
      type: Actions.Search.RUN_ADVANCED,
      response: { folder: inbox, keyword, query, data: matches },
    });
  });

  it('should dispatch action on runAdvancedSearch to match recipientName', async () => {
    const store = mockStore();
    mockApiRequest(searchResponse);
    const keyword = 'SM_CERNER';
    const query = { category: 'covid', queryData: {} };
    const matches = findByKeyword(keyword, searchResponse.data);
    await store.dispatch(runAdvancedSearch(inbox, query, keyword));
    expect(store.getActions()).to.deep.include({ type: Actions.Search.START });
    expect(store.getActions()).to.deep.include({
      type: Actions.Search.RUN_ADVANCED,
      response: { folder: inbox, keyword, query, data: matches },
    });
  });

  it('should dispatch action on runAdvancedSearch resolving with SM99 error', async () => {
    const store = mockStore();
    mockFetch(customErrorResponse, false);
    const keyword = 'test';
    const query = { category: 'covid', queryData: {} };
    await store.dispatch(runAdvancedSearch(inbox, query, keyword));
    expect(store.getActions()).to.deep.include({
      type: Actions.Search.START,
    });
    expect(store.getActions()).to.deep.include({
      type: Actions.Search.RUN_ADVANCED,
      response: { folder: inbox, query, data: [] },
    });
  });

  it('should dispatch alert on runAdvancedSearch error', async () => {
    const store = mockStore();
    mockFetch(errorResponse, false);
    const keyword = 'test';
    const query = { category: 'covid', queryData: {} };
    await store.dispatch(runAdvancedSearch(inbox, query, keyword));
    expect(store.getActions()).to.deep.include({
      type: Actions.Search.START,
    });
    const err = errorResponse.errors[0];
    expect(store.getActions()).to.deep.include({
      type: Actions.Alerts.ADD_ALERT,
      payload: {
        alertType: 'error',
        header: err.title,
        content: err.detail,
        response: err,
      },
    });
  });

  it('should dispatch actions on searchSort, SearchPage and ClearSearchResults', async () => {
    const store = mockStore();
    const sort = 'SENT_DATE_ASCENDING';
    await store.dispatch(setSearchSort(sort));
    expect(store.getActions()).to.deep.include({
      type: Actions.Search.SET_SORT,
      payload: sort,
    });

    const page = 2;
    await store.dispatch(setSearchPage(page));
    expect(store.getActions()).to.deep.include({
      type: Actions.Search.SET_PAGE,
      payload: page,
    });

    await store.dispatch(clearSearchResults());
    expect(store.getActions()).to.deep.include({
      type: Actions.Search.CLEAR,
    });
  });
});
