import sinon from 'sinon';
import { expect } from 'chai';

import * as preferencesActions from '../../actions';
import reducer from '../../reducers';

describe('preferencesReducer', () => {
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

  it('uses Date.now() to set the `savedAt` timestamp when the `SAVED_DASHBOARD_PREFERENCES` action is dispatched', () => {
    const ts = 1544809132931;
    const dateNowStub = sinon.stub(Date, 'now').callsFake(() => ts);
    action = {
      type: preferencesActions.SAVED_DASHBOARD_PREFERENCES,
    };
    const newState = reducer(state, action);
    expect(dateNowStub.called);
    expect(newState.savedAt).to.equal(ts);
    expect(newState.dashboard).to.be.deep.equal({});
    expect(newState.availableBenefits).to.be.deep.equal([]);
    dateNowStub.restore();
  });

  describe('SET_DASHBOARD_USER_PREFERENCES', () => {
    let userPreferencesResponse;

    it('correctly parses the server payload and updates the state when the user has set preferences', () => {
      userPreferencesResponse = {
        data: {
          id: '',
          type: 'arrays',
          attributes: {
            userPreferences: [
              {
                code: 'benefits',
                title:
                  'the benefits a veteran is interested in, so VA.gov can help you apply for them',
                userPreferences: [
                  {
                    code: 'education-training',
                    description: 'Info about education and training benefits',
                  },
                ],
              },
            ],
          },
        },
      };
      state = {
        dashboard: {
          appeals: true,
          'education-training': false,
        },
      };
      action = {
        type: preferencesActions.SET_DASHBOARD_USER_PREFERENCES,
        payload: userPreferencesResponse,
      };
      const newState = reducer(state, action);
      expect(newState.dashboard).to.be.deep.equal({
        'education-training': true,
      });
      expect(newState.userBenefitsLoadingStatus).to.eql('loaded');
    });
    it('correctly parses the server payload and updates the state when the user has not set preferences', () => {
      userPreferencesResponse = {
        data: {
          id: '',
          type: 'arrays',
          attributes: {
            userPreferences: [],
          },
        },
      };
      state = {
        dashboard: {
          appeals: true,
          'education-training': false,
        },
      };
      action = {
        type: preferencesActions.SET_DASHBOARD_USER_PREFERENCES,
        payload: userPreferencesResponse,
      };
      const newState = reducer(state, action);
      expect(newState.dashboard).to.be.deep.equal({});
      expect(newState.userBenefitsLoadingStatus).to.eql('loaded');
    });
  });
});
