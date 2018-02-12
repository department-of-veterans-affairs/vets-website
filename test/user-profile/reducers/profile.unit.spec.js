import { expect } from 'chai';

import reducer from '../../../src/js/user-profile/reducers/profile.js';
import { UPDATE_LOGGEDIN_STATUS } from '../../../src/js/login/actions';

import {
  CREATE_MHV_ACCOUNT_SUCCESS,
  FETCH_MHV_ACCOUNT_SUCCESS,
  PROFILE_LOADING_FINISHED
} from '../../../src/js/user-profile/actions';

describe('Profile reducer', () => {
  it('should set loading to false when profile is done loading', () => {
    const state = reducer({}, { type: PROFILE_LOADING_FINISHED });
    expect(state.loading).to.be.false;
  });

  it('should set loading to false when logged in status changes', () => {
    const state = reducer({}, { type: UPDATE_LOGGEDIN_STATUS });
    expect(state.loading).to.be.false;
  });

  it('should set MHV account state after it is fetched', () => {
    const state = reducer({
      mhv: {
        account: {
          state: 'unknown'
        }
      }
    }, {
      type: FETCH_MHV_ACCOUNT_SUCCESS,
      data: {
        attributes: {
          accountState: 'upgraded'
        }
      }
    });

    expect(state.mhv.account.state).to.eq('upgraded');
  });

  it('should start polling after MHV account creation', () => {
    const state = reducer({
      mhv: {
        account: {
          state: 'unknown'
        }
      }
    }, { type: CREATE_MHV_ACCOUNT_SUCCESS });
    expect(state.mhv.account.polling).to.be.true;
    expect(state.mhv.account.polledTimes).to.eq(0);
  });

  it('should continue polling for MHV account state', () => {
    const state = reducer({
      mhv: {
        account: {
          polling: true,
          polledTimes: 0,
          state: 'registered'
        }
      }
    }, {
      type: FETCH_MHV_ACCOUNT_SUCCESS,
      data: {
        attributes: {
          accountState: 'registered'
        }
      }
    });

    expect(state.mhv.account.polling).to.be.true;
    expect(state.mhv.account.polledTimes).to.eq(1);
  });

  it('should stop polling for MHV account state once upgraded', () => {
    const state = reducer({
      mhv: {
        account: {
          polling: true,
          polledTimes: 2,
          state: 'registered'
        }
      }
    }, {
      type: FETCH_MHV_ACCOUNT_SUCCESS,
      data: {
        attributes: {
          accountState: 'upgraded'
        }
      }
    });

    expect(state.mhv.account.polling).to.be.false;
    expect(state.mhv.account.polledTimes).to.eq(0);
  });

  it('should stop polling for MHV account state upon reaching the limit for polling', () => {
    const state = reducer({
      mhv: {
        account: {
          polling: true,
          polledTimes: 10,
          state: 'registered'
        }
      }
    }, {
      type: FETCH_MHV_ACCOUNT_SUCCESS,
      data: {
        attributes: {
          accountState: 'registered'
        }
      }
    });

    expect(state.mhv.account.polling).to.be.false;
    expect(state.mhv.account.polledTimes).to.eq(0);
  });
});
