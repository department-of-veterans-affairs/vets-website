import { createStore, applyMiddleware } from 'redux';
import { expect } from 'chai';
import thunk from 'redux-thunk';
import { breadcrumbsReducer } from '../../reducers/breadcrumbs';
import { setBreadcrumbs, setPreviousUrl } from '../../actions/breadcrumbs';
import { Breadcrumbs, Paths } from '../../util/constants';

describe('breadcrumbs reducer', () => {
  it('should return initial state', () => {
    const state = breadcrumbsReducer(undefined, {});
    
    expect(state).to.have.property('list');
    expect(state).to.have.property('crumbsList');
    expect(state).to.have.property('previousUrl');
    expect(state.previousUrl).to.equal(Paths.INBOX);
  });

  const mockStore = (initialState) => {
    return createStore(breadcrumbsReducer, initialState, applyMiddleware(thunk));
  };

  it('should set breadcrumbs with valid crumbs', async () => {
    const store = mockStore();
    const testCrumb = {
      href: '/test',
      label: 'Test Crumb',
    };
    
    await store.dispatch(setBreadcrumbs([testCrumb]));
    const state = store.getState();
    
    expect(state.list).to.deep.equal(testCrumb);
    expect(state.crumbsList).to.have.lengthOf(4);
    expect(state.crumbsList[3]).to.deep.equal(testCrumb);
  });

  it('should set default breadcrumbs when crumbs array is empty', async () => {
    const store = mockStore();
    
    await store.dispatch(setBreadcrumbs([]));
    const state = store.getState();
    
    expect(state.list).to.deep.equal(Breadcrumbs.MESSAGES);
    expect(state.crumbsList).to.have.lengthOf(3);
  });

  it('should set previous URL', async () => {
    const store = mockStore();
    const testUrl = '/test-url';
    
    await store.dispatch(setPreviousUrl(testUrl));
    const state = store.getState();
    
    expect(state.previousUrl).to.equal(testUrl);
  });

  it('should handle multiple breadcrumb updates', async () => {
    const store = mockStore();
    const firstCrumb = { href: '/first', label: 'First' };
    const secondCrumb = { href: '/second', label: 'Second' };
    
    await store.dispatch(setBreadcrumbs([firstCrumb]));
    await store.dispatch(setBreadcrumbs([secondCrumb]));
    const state = store.getState();
    
    expect(state.list).to.deep.equal(secondCrumb);
    expect(state.crumbsList[3]).to.deep.equal(secondCrumb);
  });
});
