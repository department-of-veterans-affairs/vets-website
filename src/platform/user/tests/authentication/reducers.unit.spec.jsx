import { expect } from 'chai';
import authReducer, { initialState } from '../../authentication/reducers';

describe('authentication - reducers', () => {
  it('should return the default state', () => {
    const state = authReducer(undefined, {});
    expect(state).to.equal(initialState);
  });

  it('should log out the user', () => {
    const state = authReducer(
      { currentlyLoggedIn: true, hasCheckedKeepAlive: true },
      { type: 'LOG_OUT' },
    );
    expect(state.currentlyLoggedIn).to.be.false;
  });

  it('should change currentlySignedIn to true', () => {
    const state = authReducer(initialState, {
      type: 'UPDATE_LOGGEDIN_STATUS',
      value: true,
    });
    expect(state.currentlyLoggedIn).to.be.true;
  });

  it('should update hasKeepAlive', () => {
    const state = authReducer(initialState, {
      type: 'CHECK_KEEP_ALIVE',
    });
    expect(state.hasCheckedKeepAlive).to.be.true;
  });
});
