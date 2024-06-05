import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { getCategories } from '../../actions/categories';
import categoriesResponse from '../e2e/fixtures/categories-response.json';
import { categoriesReducer } from '../../reducers/categories';

describe('categories reducer', () => {
  const mockStore = () => {
    return createStore(categoriesReducer, applyMiddleware(thunk));
  };

  it('should dispatch a list of categories', async () => {
    const store = mockStore();
    mockApiRequest(categoriesResponse);

    await store.dispatch(getCategories());
    expect(store.getState().categories).to.deep.equal(
      categoriesResponse.data.attributes.messageCategoryType,
    );
  });
});
