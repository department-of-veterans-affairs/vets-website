import { expect } from 'chai';

import reducer from '../../../profile/reducers';
import { UPDATE_LOGGEDIN_STATUS } from '../../../authentication/actions';

import {
  FETCH_MHV_ACCOUNT_FAILURE,
  FETCH_MHV_ACCOUNT_SUCCESS,
  FETCHING_MHV_ACCOUNT,
  PROFILE_LOADING_FINISHED,
  REMOVING_SAVED_FORM_SUCCESS,
} from '../../../profile/actions';

describe('Profile reducer', () => {
  describe('initial state', () => {
    it('should set mhvAccount.loading to false', () => {
      const state = reducer(undefined, { type: 'not a valid event type' });
      expect(state.mhvAccount.loading).to.be.false;
    });
  });

  it('should set loading to false when profile is done loading', () => {
    const state = reducer({}, { type: PROFILE_LOADING_FINISHED });
    expect(state.loading).to.be.false;
  });

  it('should set loading to false when logged in status changes', () => {
    const state = reducer({}, { type: UPDATE_LOGGEDIN_STATUS });
    expect(state.loading).to.be.false;
  });

  it('should be loading when fetching MHV account', () => {
    const state = reducer({ mhvAccount: {} }, { type: FETCHING_MHV_ACCOUNT });
    expect(state.mhvAccount.loading).to.be.true;
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
