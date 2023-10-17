import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { Actions } from '../../util/actionTypes';
import { getCategories } from '../../actions/categories';
import * as categoriesResponse from '../e2e/fixtures/categories-response.json';

describe('categories actions', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  it('should dispatch action on getCategories', () => {
    const store = mockStore();
    mockApiRequest(categoriesResponse);
    store.dispatch(getCategories()).then(() => {
      const actions = store.getActions();
      expect(actions[0].type).to.equal({
        type: Actions.Category.GET_LIST,
        payload: categoriesResponse,
      });
    });
  });
  it('should dispatch action on getCategories error', () => {
    const store = mockStore();
    mockApiRequest({}, false);
    store.dispatch(getCategories()).catch(() => {
      const actions = store.getActions();
      expect(actions[0].type).to.equal({
        type: Actions.Category.GET_LIST_ERROR,
      });
    });
  });
});
