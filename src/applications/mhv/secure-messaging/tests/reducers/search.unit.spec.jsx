import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import { createStore, applyMiddleware } from 'redux';
import { expect } from 'chai';
import thunk from 'redux-thunk';
import { searchReducer } from '../../reducers/search';

import {
  runAdvancedSearch,
  findByKeyword,
  setSearchSort,
  setSearchPage,
} from '../../actions/search';
import searchResponse from '../e2e/fixtures/search-COVID-results.json';
import inbox from '../fixtures/folder-inbox-metadata.json';

describe('search reducer', () => {
  const mockStore = (initialState = {}) => {
    return createStore(searchReducer, initialState, applyMiddleware(thunk));
  };

  it('should dispatch an action on advanced search', async () => {
    const store = mockStore();
    mockApiRequest(searchResponse);
    const keyword = 'test';
    const query = { category: 'covid' };
    const matches = findByKeyword(keyword, searchResponse.data);
    await store.dispatch(runAdvancedSearch(inbox, query, keyword));
    const obj = {
      searchResults: matches.map(message => {
        const msgAttr = message.attributes;
        return { ...msgAttr };
      }),
      searchFolder: inbox,
      keyword,
      query,
      awaitingResults: false,
    };
    expect(store.getState()).to.deep.equal(obj);
  });

  it('should dispatch an action on setSearchSort', async () => {
    const store = mockStore();
    const sort = 'sent-date';
    await store.dispatch(setSearchSort(sort));
    expect(store.getState()).to.deep.equal({ searchSort: sort });
  });

  it('should dispatch an action on setSearchPage', async () => {
    const store = mockStore();
    const page = 2;
    await store.dispatch(setSearchPage(page));
    expect(store.getState()).to.deep.equal({ page });
  });
});
