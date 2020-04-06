import sinon from 'sinon';

import * as preferencesActions from '../../actions';
import reducer from '../../reducers';

describe('preferencesReducer', () => {
  let state;
  let action;

  beforeEach(() => {
    state = undefined;
  });

  describe('default state', () => {
    action = { type: 'NOT_RELEVANT' };
    const newState = reducer(state, action);
    test('sets `dashboard` to empty object', () => {
      expect(newState.dashboard).toEqual({});
    });
    test('sets `availableBenefits` to empty array', () => {
      expect(newState.availableBenefits).toEqual([]);
    });
    test('sets `dismissedBenefitAlerts` to empty array', () => {
      expect(newState.dismissedBenefitAlerts).toEqual([]);
    });
  });

  describe('FETCH_USER_PREFERENCES_STARTED', () => {
    test('sets the `userBenefitsLoadingStatus` to `pending`', () => {
      action = {
        type: preferencesActions.FETCH_USER_PREFERENCES_STARTED,
      };
      const newState = reducer(state, action);
      expect(newState.userBenefitsLoadingStatus).toBe('pending');
      expect(newState.dashboard).toEqual({});
      expect(newState.availableBenefits).toEqual([]);
    });
  });

  describe('FETCH_USER_PREFERENCES_SUCCEEDED', () => {
    let userPreferencesResponse;
    test('sets the `userBenefitsLoadingStatus` to `loaded`', () => {
      userPreferencesResponse = {};
      action = {
        type: preferencesActions.FETCH_USER_PREFERENCES_SUCCEEDED,
        payload: userPreferencesResponse,
      };
      const newState = reducer(state, action);
      expect(newState.userBenefitsLoadingStatus).toBe('loaded');
      expect(newState.availableBenefits).toEqual([]);
    });

    test(
      'correctly parses the server payload and updates the `dashboard` and `savedDashboard` state when the user has set preferences',
      () => {
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
          type: preferencesActions.FETCH_USER_PREFERENCES_SUCCEEDED,
          payload: userPreferencesResponse,
        };
        const newState = reducer(state, action);
        expect(newState.dashboard).toEqual({
          'education-training': true,
        });
        expect(newState.savedDashboard).toEqual({
          'education-training': true,
        });
      }
    );

    test(
      'correctly parses the server payload and updates the state when the user has not set preferences',
      () => {
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
          type: preferencesActions.FETCH_USER_PREFERENCES_SUCCEEDED,
          payload: userPreferencesResponse,
        };
        const newState = reducer(state, action);
        expect(newState.dashboard).toEqual({});
        expect(newState.savedDashboard).toEqual({});
      }
    );
  });

  describe('FETCH_USER_PREFERENCES_FAILED', () => {
    test('sets the `userBenefitsLoadingStatus` to `error`', () => {
      action = {
        type: preferencesActions.FETCH_USER_PREFERENCES_FAILED,
      };
      const newState = reducer(state, action);
      expect(newState.userBenefitsLoadingStatus).toBe('error');
      expect(newState.dashboard).toEqual({});
      expect(newState.availableBenefits).toEqual([]);
    });
  });

  describe('FETCH_ALL_BENEFITS_STARTED', () => {
    test('sets the `allBenefitsLoadingStatus` to `pending`', () => {
      action = {
        type: preferencesActions.FETCH_ALL_BENEFITS_STARTED,
      };
      const newState = reducer(state, action);
      expect(newState.allBenefitsLoadingStatus).toBe('pending');
      expect(newState.dashboard).toEqual({});
      expect(newState.availableBenefits).toEqual([]);
    });
  });

  describe('FETCH_ALL_BENEFITS_SUCCEEDED', () => {
    let newState;
    const response = {
      data: {
        attributes: {
          code: 'benefits',
          title: 'Available Benefits',
          preferenceChoices: [
            {
              code: 'health-care',
              description: 'Get health care coverage',
            },
            {
              code: 'disability',
              description:
                'Find benefits for an illness or injury related to a veterans service benefits',
            },
          ],
        },
      },
    };
    beforeEach(() => {
      action = {
        type: preferencesActions.FETCH_ALL_BENEFITS_SUCCEEDED,
        payload: response,
      };
      newState = reducer(state, action);
    });
    test('sets the `allBenefitsLoadingStatus` to `loaded`', () => {
      expect(newState.allBenefitsLoadingStatus).toBe('loaded');
      expect(newState.dashboard).toEqual({});
    });
    test('sets the `availableBenefits`', () => {
      expect(newState.availableBenefits).toEqual([
        { code: 'health-care', description: 'Get health care coverage' },
        {
          code: 'disability',
          description:
            'Find benefits for an illness or injury related to a veterans service benefits',
        },
      ]);
      expect(newState.dashboard).toEqual({});
    });
  });

  describe('FETCH_ALL_BENEFITS_FAILED', () => {
    test('sets the `allBenefitsLoadingStatus` to `error`', () => {
      action = {
        type: preferencesActions.FETCH_ALL_BENEFITS_FAILED,
      };
      const newState = reducer(state, action);
      expect(newState.allBenefitsLoadingStatus).toBe('error');
      expect(newState.dashboard).toEqual({});
      expect(newState.availableBenefits).toEqual([]);
    });
  });

  describe('SAVE_USER_PREFERENCES_STARTED', () => {
    test('sets the `saveStatus` to `pending`', () => {
      action = {
        type: preferencesActions.SAVE_USER_PREFERENCES_STARTED,
      };
      const newState = reducer(state, action);
      expect(newState.saveStatus).toBe('pending');
      expect(newState.dashboard).toEqual({});
      expect(newState.availableBenefits).toEqual([]);
    });
  });

  describe('SAVE_USER_PREFERENCES_SUCCEEDED', () => {
    test('sets the `saveStatus` to `loaded`', () => {
      action = {
        type: preferencesActions.SAVE_USER_PREFERENCES_SUCCEEDED,
      };
      const newState = reducer(state, action);
      expect(newState.saveStatus).toBe('loaded');
      expect(newState.dashboard).toEqual({});
      expect(newState.availableBenefits).toEqual([]);
    });

    test('uses Date.now() to set the `savedAt` timestamp', () => {
      const ts = 1544809132931;
      const dateNowStub = sinon.stub(Date, 'now').callsFake(() => ts);
      action = {
        type: preferencesActions.SAVE_USER_PREFERENCES_SUCCEEDED,
      };
      const newState = reducer(state, action);
      expect(dateNowStub.called);
      expect(newState.savedAt).toBe(ts);
      expect(newState.dashboard).toEqual({});
      expect(newState.availableBenefits).toEqual([]);
      dateNowStub.restore();
    });
  });

  describe('SAVE_USER_PREFERENCES_FAILED', () => {
    test('sets the `saveStatus` to `error`', () => {
      action = {
        type: preferencesActions.SAVE_USER_PREFERENCES_FAILED,
      };
      const newState = reducer(state, action);
      expect(newState.saveStatus).toBe('error');
      expect(newState.dashboard).toEqual({});
      expect(newState.availableBenefits).toEqual([]);
    });
  });

  describe('SET_USER_PREFERENCE', () => {
    test('adds new prefs to dashboard with a value of `true`', () => {
      state = {
        dashboard: {},
      };
      action = {
        type: preferencesActions.SET_USER_PREFERENCE,
        code: 'pref1',
        value: true,
      };
      const newState = reducer(state, action);
      expect(newState.dashboard).toEqual({ pref1: true });
    });
    test(
      'completely removes prefs from dashboard when their new value is `false`',
      () => {
        state = {
          dashboard: { pref1: true, pref2: true },
        };
        action = {
          type: preferencesActions.SET_USER_PREFERENCE,
          code: 'pref1',
          value: false,
        };
        const newState = reducer(state, action);
        expect(newState.dashboard).toEqual({ pref2: true });
      }
    );
    test('does not touch the savedDashboard when updating the dashboard', () => {
      state = {
        dashboard: { pref1: true, pref2: true },
        savedDashboard: { pref1: true, pref2: true },
      };
      action = {
        type: preferencesActions.SET_USER_PREFERENCE,
        code: 'pref1',
        value: false,
      };
      const newState = reducer(state, action);
      expect(newState.savedDashboard).toEqual({
        pref1: true,
        pref2: true,
      });
    });
  });

  describe('SET_DISMISSED_DASHBOARD_PREFERENCE_BENEFIT_ALERTS', () => {
    test('sets the `dismissedBenefitAlerts`', () => {
      action = {
        type:
          preferencesActions.SET_DISMISSED_DASHBOARD_PREFERENCE_BENEFIT_ALERTS,
        value: ['medical'],
      };
      const newState = reducer(state, action);
      expect(newState.dismissedBenefitAlerts).toEqual(['medical']);
    });
  });

  describe('RESTORE_PREVIOUS_USER_PREFERENCES', () => {
    test('sets the `dashboard` to the value of `savedDashboard`', () => {
      state = {
        dashboard: {},
        savedDashboard: {
          appeals: true,
          'education-training': false,
        },
      };
      action = {
        type: preferencesActions.RESTORE_PREVIOUS_USER_PREFERENCES,
      };
      const newState = reducer(state, action);
      expect(newState.dashboard).toEqual(state.savedDashboard);
    });
  });
});
