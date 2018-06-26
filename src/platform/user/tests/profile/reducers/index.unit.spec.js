import { expect } from 'chai';

import reducer from '../../../profile/reducers';
import { UPDATE_LOGGEDIN_STATUS } from '../../../../user/authentication/actions';

import {
  CREATE_MHV_ACCOUNT_FAILURE,
  CREATE_MHV_ACCOUNT_SUCCESS,
  CREATING_MHV_ACCOUNT,
  FETCH_MHV_ACCOUNT_FAILURE,
  FETCH_MHV_ACCOUNT_SUCCESS,
  FETCHING_MHV_ACCOUNT,
  UPGRADE_MHV_ACCOUNT_FAILURE,
  UPGRADE_MHV_ACCOUNT_SUCCESS,
  UPGRADING_MHV_ACCOUNT,
  PROFILE_LOADING_FINISHED,
  REMOVING_SAVED_FORM_SUCCESS
} from '../../../profile/actions';

describe('Profile reducer', () => {
  it('should set loading to false when profile is done loading', () => {
    const state = reducer({}, { type: PROFILE_LOADING_FINISHED });
    expect(state.loading).to.be.false;
  });

  it('should set loading to false when logged in status changes', () => {
    const state = reducer({}, { type: UPDATE_LOGGEDIN_STATUS });
    expect(state.loading).to.be.false;
  });

  it('should be loading when creating MHV account', () => {
    const state = reducer({ mhv: { account: {} } }, { type: CREATING_MHV_ACCOUNT });
    expect(state.mhv.account.loading).to.be.true;
  });

  it('should be loading when upgrading MHV account', () => {
    const state = reducer({ mhv: { account: {} } }, { type: UPGRADING_MHV_ACCOUNT });
    expect(state.mhv.account.loading).to.be.true;
  });

  it('should be loading when fetching MHV account', () => {
    const state = reducer({ mhv: { account: {} } }, { type: FETCHING_MHV_ACCOUNT });
    expect(state.mhv.account.loading).to.be.true;
  });

  it('should handle failed MHV account creation', () => {
    const state = reducer({
      mhv: {
        account: {
          level: null,
          state: 'no_account'
        }
      }
    }, {
      type: CREATE_MHV_ACCOUNT_FAILURE,
      errors: [{ title: 'error', code: 500 }]
    });
    expect(state.mhv.account.loading).to.be.false;
    expect(state.mhv.account.state).to.eq('register_failed');
  });

  it('should handle successful MHV account creation', () => {
    const state = reducer({
      mhv: {
        account: {
          level: null,
          state: 'no_account'
        }
      }
    }, {
      type: CREATE_MHV_ACCOUNT_SUCCESS,
      data: {
        attributes: {
          accountLevel: 'Advanced',
          accountState: 'registered'
        }
      }
    });

    expect(state.mhv.account.level).to.eq('Advanced');
    expect(state.mhv.account.state).to.eq('registered');
  });

  it('should handle failed MHV account upgrade', () => {
    const state = reducer({
      mhv: {
        account: {
          level: 'Advanced',
          state: 'registered'
        }
      }
    }, {
      type: UPGRADE_MHV_ACCOUNT_FAILURE,
      errors: [{ title: 'error', code: 500 }]
    });
    expect(state.mhv.account.loading).to.be.false;
    expect(state.mhv.account.state).to.eq('upgrade_failed');
  });

  it('should handle successful MHV account upgrade', () => {
    const state = reducer({
      mhv: {
        account: {
          level: 'Advanced',
          state: 'registered'
        }
      }
    }, {
      type: UPGRADE_MHV_ACCOUNT_SUCCESS,
      data: {
        attributes: {
          accountLevel: 'Premium',
          accountState: 'upgraded'
        }
      }
    });

    expect(state.mhv.account.level).to.eq('Premium');
    expect(state.mhv.account.state).to.eq('upgraded');
  });

  it('should handle failure to fetch MHV account', () => {
    const state = reducer({
      mhv: { account: {} }
    }, {
      type: FETCH_MHV_ACCOUNT_FAILURE,
      errors: [{ title: 'error', code: 500 }]
    });
    expect(state.mhv.account.errors).to.exist;
    expect(state.mhv.account.loading).to.be.false;
  });

  it('should set MHV account level and state after it is fetched', () => {
    const state = reducer({
      mhv: {
        account: {
          level: null,
          state: null
        }
      }
    }, {
      type: FETCH_MHV_ACCOUNT_SUCCESS,
      data: {
        attributes: {
          accountLevel: 'Premium',
          accountState: 'upgraded'
        }
      }
    });

    expect(state.mhv.account.level).to.eq('Premium');
    expect(state.mhv.account.state).to.eq('upgraded');
  });

  it('should remove the right form when deleting a form', () => {
    const state = reducer({
      savedForms: [{ form: 1 }, { form: 2 }]
    },  {
      type: REMOVING_SAVED_FORM_SUCCESS,
      formId: 1
    });

    expect(state.savedForms.length).to.eq(1);
    expect(state.savedForms).to.deep.equal([{ form: 2 }]);
  });
});
