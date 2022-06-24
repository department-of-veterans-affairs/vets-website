import { expect } from 'chai';

import {
  FETCH_STATIC_DATA_STARTED,
  FETCH_STATIC_DATA_SUCCEEDED,
} from '../../actions';
import drupalStaticDataReducer from '../../reducers';

describe('drupalStaticDataReducer', () => {
  let state;
  let action;

  beforeEach(() => {
    state = undefined;
    action = { type: 'NOT_RELEVANT' };
  });

  it('flips loading to true when the FETCH_STATIC_DATA_STARTED action is dispatched', () => {
    action = {
      type: FETCH_STATIC_DATA_STARTED,
      payload: {
        statePropName: 'dummy',
      },
    };
    const newState = drupalStaticDataReducer(state, action);
    expect(newState.dummy.loading).to.be.true;
  });

  it('flips loading to false when the FETCH_STATIC_DATA_SUCCEEDED action is dispatched', () => {
    action = {
      type: FETCH_STATIC_DATA_SUCCEEDED,
      payload: {
        statePropName: 'dummy',
        data: {
          dummyA: 'A',
          dummyB: 'B',
        },
      },
    };
    const newState = drupalStaticDataReducer(state, action);
    expect(newState.dummy.loading).to.be.false;
  });

  it('adds fetched data into state when the FETCH_STATIC_DATA_SUCCEEDED action is dispatched', () => {
    action = {
      type: FETCH_STATIC_DATA_SUCCEEDED,
      payload: {
        statePropName: 'dummy',
        data: {
          dummyA: 'A',
          dummyB: 'B',
        },
      },
    };
    const newState = drupalStaticDataReducer(state, action);
    expect(newState.dummy.data).to.be.deep.equal(action.payload.data);
  });
});
