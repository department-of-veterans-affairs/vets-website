import { expect } from 'chai';

import reducer from '../../../components/connected-apps/reducers/connectedApps';
import {
  DELETED_APP_ALERT_DISMISSED,
  DELETING_CONNECTED_APP,
  ERROR_LOADING_CONNECTED_APPS,
  ERROR_DELETING_CONNECTED_APP,
  FINISHED_LOADING_CONNECTED_APPS,
  FINISHED_DELETING_CONNECTED_APP,
  LOADING_CONNECTED_APPS,
} from '../../../components/connected-apps/actions';

describe('Connected Apps reducer', () => {
  it('returns the initial state', () => {
    const action = {};
    const state = reducer(undefined, action);
    expect(state).to.be.deep.equal({
      apps: [],
      errors: [],
      loading: false,
    });
  });

  it('handles the action type LOADING_CONNECTED_APPS', () => {
    const action = { type: LOADING_CONNECTED_APPS };
    const state = reducer(undefined, action);
    expect(state).to.be.deep.equal({
      apps: [],
      errors: [],
      loading: true,
    });
  });

  it('handles the action type FINISHED_LOADING_CONNECTED_APPS', () => {
    const action = { data: ['hello'], type: FINISHED_LOADING_CONNECTED_APPS };
    const state = reducer(undefined, action);
    expect(state).to.be.deep.equal({
      apps: ['hello'],
      errors: [],
      loading: false,
    });
  });

  it('handles the action type ERROR_LOADING_CONNECTED_APPS', () => {
    const action = { errors: ['hello'], type: ERROR_LOADING_CONNECTED_APPS };
    const state = reducer(undefined, action);
    expect(state).to.be.deep.equal({
      apps: [],
      errors: ['hello'],
      loading: false,
    });
  });

  it('handles the action type DELETING_CONNECTED_APP', () => {
    const action = { appId: '1', type: DELETING_CONNECTED_APP };
    const prevState = {
      apps: [{ id: '1', deleting: false }, { id: '2', deleting: false }],
      deleting: false,
      errors: [],
      loading: false,
    };
    const state = reducer(prevState, action);
    expect(state).to.be.deep.equal({
      apps: [{ id: '1', deleting: true }, { id: '2', deleting: false }],
      deleting: false,
      errors: [],
      loading: false,
    });
  });

  it('handles the action type ERROR_DELETING_CONNECTED_APP', () => {
    const action = {
      appId: '1',
      errors: ['hello'],
      type: ERROR_DELETING_CONNECTED_APP,
    };
    const prevState = {
      apps: [
        { id: '1', deleting: true, errors: [] },
        { id: '2', deleting: false, errors: [] },
      ],
      errors: [],
      loading: false,
    };
    const state = reducer(prevState, action);
    expect(state).to.be.deep.equal({
      apps: [
        { id: '1', deleting: false, errors: ['hello'] },
        { id: '2', deleting: false, errors: [] },
      ],
      errors: [],
      loading: false,
    });
  });

  it('handles the action type FINISHED_DELETING_CONNECTED_APP', () => {
    const action = { appId: '1', type: FINISHED_DELETING_CONNECTED_APP };
    const prevState = {
      apps: [
        { id: '1', deleting: true, deleted: false },
        { id: '2', deleting: false, deleted: false },
      ],
      errors: [],
      loading: false,
    };
    const state = reducer(prevState, action);
    expect(state).to.be.deep.equal({
      apps: [
        { id: '1', deleting: false, deleted: true },
        { id: '2', deleting: false, deleted: false },
      ],
      errors: [],
      loading: false,
    });
  });

  it('handles the action type DELETED_APP_ALERT_DISMISSED', () => {
    const action = { appId: '1', type: DELETED_APP_ALERT_DISMISSED };
    const prevState = {
      apps: [{ id: '1' }, { id: '2' }],
      errors: [],
      loading: false,
    };
    const state = reducer(prevState, action);
    expect(state).to.be.deep.equal({
      apps: [{ id: '2' }],
      errors: [],
      loading: false,
    });
  });
});
