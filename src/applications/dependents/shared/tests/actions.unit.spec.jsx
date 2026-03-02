import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  createGetHandler,
  jsonResponse,
} from 'platform/testing/unit/msw-adapter';
import { server } from 'platform/testing/unit/mocha-setup';
import {
  fetchDependents,
  DEPENDENTS_FETCH_STARTED,
  DEPENDENTS_FETCH_SUCCESS,
  DEPENDENTS_FETCH_FAILED,
  DEPENDENTS_URL,
} from '../actions';

const goodResponse = {
  data: { attributes: { persons: [{ relationship: 'child' }] } },
};
const badResponse = {
  data: { errors: [{ detail: 'Not good' }] },
};

describe('fetchDependents actions', () => {
  let store;
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  beforeEach(() => {
    store = mockStore();
  });

  afterEach(() => {
    server.resetHandlers();
    store.clearActions();
  });

  it('should dispatch on success when `persons` returned from api', async () => {
    server.use(
      createGetHandler(DEPENDENTS_URL, () => {
        return jsonResponse(goodResponse, { status: 200 });
      }),
    );

    await store.dispatch(fetchDependents());

    const actions = store.getActions();

    expect(actions.length).to.eql(2);
    expect(actions[0]).to.eql({ type: DEPENDENTS_FETCH_STARTED });
    expect(actions[1]).to.contain({ type: DEPENDENTS_FETCH_SUCCESS });
  });

  it('should dispatch on success when `persons` is missing', async () => {
    server.use(
      createGetHandler(DEPENDENTS_URL, () => {
        return jsonResponse({ data: { attributes: {} } }, { status: 200 });
      }),
    );

    await store.dispatch(fetchDependents());

    const actions = store.getActions();

    expect(actions.length).to.eql(2);
    expect(actions[0]).to.eql({ type: DEPENDENTS_FETCH_STARTED });
  });

  it('when `persons` returned from api', async () => {
    server.use(
      createGetHandler(DEPENDENTS_URL, () => {
        return jsonResponse(badResponse, { status: 400 });
      }),
    );

    await store.dispatch(fetchDependents());

    const actions = store.getActions();

    expect(actions.length).to.eql(2);
    expect(actions[0]).to.eql({ type: DEPENDENTS_FETCH_STARTED });
    expect(actions[1]).to.contain({ type: DEPENDENTS_FETCH_FAILED });
  });
});
