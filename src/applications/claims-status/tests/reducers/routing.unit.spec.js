import { expect } from 'chai';

import routingReducer from '../../reducers/routing';
import { SET_LAST_PAGE } from '../../actions/types';

describe('routingReducer', () => {
  it('should set the last page to action.page on first call', () => {
    const state = routingReducer(undefined, {
      type: SET_LAST_PAGE,
      page: '/testing',
    });

    expect(state.lastPage).to.equal('/testing');
    expect(state.history[0]).to.equal('testing');
  });
  context('when history already has 1 record', () => {
    it('should add to the history array and set the last page with the new action.page', () => {
      const state = routingReducer(
        {
          history: ['testing'],
          lastPage: '/testing',
        },
        {
          type: SET_LAST_PAGE,
          page: '/new-page',
        },
      );

      expect(state.lastPage).to.equal('/new-page');
      expect(state.history.length).to.equal(2);
    });
  });

  context('when history already has 2 records', () => {
    it('should add to the history array and set the last page with the new action.page', () => {
      const state = routingReducer(
        {
          history: ['testing', 'testing2'],
        },
        {
          type: SET_LAST_PAGE,
          page: '/new-page',
        },
      );

      expect(state.lastPage).to.equal('/new-page');
      expect(state.history.length).to.equal(3);
    });
  });
});
