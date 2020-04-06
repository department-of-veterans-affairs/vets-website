import routingReducer from '../../reducers/routing';
import { SET_LAST_PAGE } from '../../actions';

describe('routingReducer', () => {
  test('should set the last page to null on first call', () => {
    const state = routingReducer(undefined, {
      type: SET_LAST_PAGE,
      page: '/testing',
    });

    expect(state.lastPage).toBeNull();
    expect(state.history[0]).toBe('testing');
  });
  test('should set the last page with history items', () => {
    const state = routingReducer(
      {
        history: ['some-url'],
      },
      {
        type: SET_LAST_PAGE,
        page: '/testing',
      },
    );

    expect(state.lastPage).toBe('some-url');
    expect(state.history.length).toBe(2);
  });
});
