import { expect } from 'chai';

import reducer from '../../../src/js/user-profile/reducers/profile.js';
import { UPDATE_LOGGEDIN_STATUS } from '../../../src/js/login/actions';
import { PROFILE_LOADING_FINISHED } from '../../../src/js/user-profile/actions';

describe('Profile reducer', () => {
  it('should set loading to false when profile is done loading', () => {
    const state = reducer({}, {
      type: PROFILE_LOADING_FINISHED
    });

    expect(state.loading).to.be.false;
  });
  it('should set loading to false when logged in status changes', () => {
    const state = reducer({}, {
      type: UPDATE_LOGGEDIN_STATUS
    });

    expect(state.loading).to.be.false;
  });
});
