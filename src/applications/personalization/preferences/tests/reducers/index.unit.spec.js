import { expect } from 'chai';

import * as preferencesActions from '../../actions';
import reducer from '../../reducers';

describe.only('preferencesReducer', () => {
  let state;
  let action;

  beforeEach(() => {
    state = undefined;
    action = { type: 'NOT_RELEVANT' };
  });

  it('defaults `dashboard` to empty object', () => {
    const newState = reducer(state, action);
    expect(newState.dashboard).to.deep.equal({});
  });

  it('defaults `availableBenefits` to empty array', () => {
    const newState = reducer(state, action);
    expect(newState.availableBenefits).to.deep.equal([]);
  });

  it('sets the `userBenefitsLoadingStatus` when the `SET_USER_PREFERENCE_REQUEST_STATUS` action is dispatched', () => {
    action = {
      type: preferencesActions.SET_USER_PREFERENCE_REQUEST_STATUS,
      status: 'pending',
    };
    const newState = reducer(state, action);
    expect(newState.userBenefitsLoadingStatus).to.equal('pending');
    expect(newState.dashboard).to.be.deep.equal({});
    expect(newState.availableBenefits).to.be.deep.equal([]);
  });

  it('sets the `allBenefitsLoadingStatus` when the `SET_ALL_PREFERENCE_OPTIONS_REQUEST_STATUS` action is dispatched', () => {
    action = {
      type: preferencesActions.SET_ALL_PREFERENCE_OPTIONS_REQUEST_STATUS,
      status: 'error',
    };
    const newState = reducer(state, action);
    expect(newState.allBenefitsLoadingStatus).to.equal('error');
    expect(newState.dashboard).to.be.deep.equal({});
    expect(newState.availableBenefits).to.be.deep.equal([]);
  });

  it('sets the `saveStatus` when the `SET_SAVE_PREFERENCES_REQUEST_STATUS` action is dispatched', () => {
    action = {
      type: preferencesActions.SET_SAVE_PREFERENCES_REQUEST_STATUS,
      status: 'loaded',
    };
    const newState = reducer(state, action);
    expect(newState.saveStatus).to.equal('loaded');
    expect(newState.dashboard).to.be.deep.equal({});
    expect(newState.availableBenefits).to.be.deep.equal([]);
  });

  it('sets the `availableBenefits` when the `SET_AVAILABLE_BENEFITS` action is dispatched', () => {
    action = {
      type: preferencesActions.SET_AVAILABLE_BENEFITS,
      preferences: [
        { code: 'benefits', title: 'benefits' },
        { code: 'benefits', title: 'benefits' },
      ],
    };
    const newState = reducer(state, action);
    expect(newState.availableBenefits).to.deep.equal([
      { code: 'benefits', title: 'benefits' },
      { code: 'benefits', title: 'benefits' },
    ]);
    expect(newState.dashboard).to.be.deep.equal({});
  });
});
