import { expect } from 'chai';
import {
  LOG_OUT,
  UPDATE_LOGGEDIN_STATUS,
  CHECK_KEEP_ALIVE,
} from '../../../authentication/actions';
import loginReducer from '../../../authentication/reducers'; // Renamed here

describe('loginReducer', () => {
  const initialState = {
    currentlyLoggedIn: false,
    hasCheckedKeepAlive: false,
  };

  it('should return the initial state when no action is provided', () => {
    const result = loginReducer(undefined, {});
    expect(result).to.deep.equal(initialState);
  });

  it('should handle UPDATE_LOGGEDIN_STATUS', () => {
    const action = {
      type: UPDATE_LOGGEDIN_STATUS,
      value: true,
    };
    const expectedState = {
      ...initialState,
      currentlyLoggedIn: true,
    };
    const result = loginReducer(initialState, action);
    expect(result).to.deep.equal(expectedState);
  });

  it('should handle LOG_OUT', () => {
    const action = {
      type: LOG_OUT,
    };
    const loggedInState = {
      ...initialState,
      currentlyLoggedIn: true,
    };
    const expectedState = {
      ...initialState,
      currentlyLoggedIn: false,
    };
    const result = loginReducer(loggedInState, action);
    expect(result).to.deep.equal(expectedState);
  });

  it('should handle CHECK_KEEP_ALIVE', () => {
    const action = {
      type: CHECK_KEEP_ALIVE,
    };
    const expectedState = {
      ...initialState,
      hasCheckedKeepAlive: true,
    };
    const result = loginReducer(initialState, action);
    expect(result).to.deep.equal(expectedState);
  });

  it('should return the current state for unknown actions', () => {
    const action = {
      type: 'UNKNOWN_ACTION',
    };
    const result = loginReducer(initialState, action);
    expect(result).to.deep.equal(initialState);
  });
});
