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
  REMOVING_SAVED_FORM_SUCCESS,
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
    const state = reducer({ mhvAccount: {} }, { type: CREATING_MHV_ACCOUNT });
    expect(state.mhvAccount.loading).to.be.true;
  });

  it('should be loading when upgrading MHV account', () => {
    const state = reducer({ mhvAccount: {} }, { type: UPGRADING_MHV_ACCOUNT });
    expect(state.mhvAccount.loading).to.be.true;
  });

  it('should be loading when fetching MHV account', () => {
    const state = reducer({ mhvAccount: {} }, { type: FETCHING_MHV_ACCOUNT });
    expect(state.mhvAccount.loading).to.be.true;
  });

  it('should handle failed MHV account creation', () => {
    const state = reducer(
      {
        mhvAccount: {
          accountLevel: null,
          accountState: 'no_account',
        },
      },
      {
        type: CREATE_MHV_ACCOUNT_FAILURE,
        errors: [{ title: 'error', code: 500 }],
      },
    );
    expect(state.mhvAccount.loading).to.be.false;
    expect(state.mhvAccount.accountState).to.eq('register_failed');
  });

  it('should handle successful MHV account creation', () => {
    const state = reducer(
      {
        mhvAccount: {
          accountLevel: null,
          accountState: 'no_account',
        },
      },
      {
        type: CREATE_MHV_ACCOUNT_SUCCESS,
        data: {
          attributes: {
            accountLevel: 'Advanced',
            accountState: 'registered',
          },
        },
      },
    );

    expect(state.mhvAccount.accountLevel).to.eq('Advanced');
    expect(state.mhvAccount.accountState).to.eq('registered');
  });

  it('should handle failed MHV account upgrade', () => {
    const state = reducer(
      {
        mhvAccount: {
          accountLevel: 'Advanced',
          accountState: 'registered',
        },
      },
      {
        type: UPGRADE_MHV_ACCOUNT_FAILURE,
        errors: [{ title: 'error', code: 500 }],
      },
    );
    expect(state.mhvAccount.loading).to.be.false;
    expect(state.mhvAccount.accountState).to.eq('upgrade_failed');
  });

  it('should handle successful MHV account upgrade', () => {
    const state = reducer(
      {
        mhvAccount: {
          accountLevel: 'Advanced',
          accountState: 'registered',
        },
        services: ['health-records', 'rx'],
      },
      {
        type: UPGRADE_MHV_ACCOUNT_SUCCESS,
        mhvAccount: {
          data: {
            attributes: {
              accountLevel: 'Premium',
              accountState: 'upgraded',
            },
          },
        },
        userProfile: {
          data: {
            attributes: {
              profile: { loa: { current: 3 } },
              vaProfile: {},
              veteranStatus: {},
              services: ['health-records', 'rx', 'messaging'],
            },
          },
        },
      },
    );

    expect(state.mhvAccount.accountLevel).to.eq('Premium');
    expect(state.mhvAccount.accountState).to.eq('upgraded');
    expect(state.services).to.contain('messaging');
  });

  it('should handle failure to fetch MHV account', () => {
    const state = reducer(
      { mhvAccount: {} },
      {
        type: FETCH_MHV_ACCOUNT_FAILURE,
        errors: [{ title: 'error', code: 500 }],
      },
    );
    expect(state.mhvAccount.errors).to.exist;
    expect(state.mhvAccount.loading).to.be.false;
  });

  it('should set MHV account level and state after it is fetched', () => {
    const state = reducer(
      {
        mhvAccount: {
          accountLevel: null,
          accountState: null,
        },
      },
      {
        type: FETCH_MHV_ACCOUNT_SUCCESS,
        data: {
          attributes: {
            accountLevel: 'Premium',
            accountState: 'upgraded',
          },
        },
      },
    );

    expect(state.mhvAccount.accountLevel).to.eq('Premium');
    expect(state.mhvAccount.accountState).to.eq('upgraded');
  });

  it('should remove the right form when deleting a form', () => {
    const state = reducer(
      {
        savedForms: [{ form: 1 }, { form: 2 }],
      },
      {
        type: REMOVING_SAVED_FORM_SUCCESS,
        formId: 1,
      },
    );

    expect(state.savedForms.length).to.eq(1);
    expect(state.savedForms).to.deep.equal([{ form: 2 }]);
  });
});
