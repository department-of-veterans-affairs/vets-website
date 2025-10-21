import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { getCategories } from '../../actions/categories';
import categoriesResponse from '../e2e/fixtures/categories-response.json';
import { categoriesReducer } from '../../reducers/categories';
import { Actions } from '../../util/actionTypes';

describe('categories reducer', () => {
  it('should return initial state', () => {
    const state = categoriesReducer(undefined, {});
    expect(state).to.have.property('categories', undefined);
  });

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

  it('should handle GET_LIST_ERROR action', () => {
    const state = categoriesReducer(undefined, {
      type: Actions.Category.GET_LIST_ERROR,
    });
    expect(state.categories).to.equal('error');
  });

  it('should handle unknown action type', () => {
    const initialState = { categories: undefined };
    const state = categoriesReducer(initialState, {
      type: 'UNKNOWN_ACTION',
    });
    expect(state).to.deep.equal(initialState);
  });
});
