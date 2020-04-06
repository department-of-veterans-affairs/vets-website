import sinon from 'sinon';
import {
  mockFetch,
  resetFetch,
  setFetchJSONFailure as setFetchFailure,
  setFetchJSONResponse as setFetchResponse,
} from 'platform/testing/unit/helpers.js';
import {
  fetchAvailableBenefits,
  savePreferences,
  fetchUserSelectedBenefits,
  setPreference,
  setDismissedBenefitAlerts,
  restorePreviousSelections,
  deletePreferences,
  updatePreferences,
  FETCH_ALL_BENEFITS_STARTED,
  FETCH_ALL_BENEFITS_FAILED,
  FETCH_ALL_BENEFITS_SUCCEEDED,
  FETCH_USER_PREFERENCES_STARTED,
  FETCH_USER_PREFERENCES_FAILED,
  FETCH_USER_PREFERENCES_SUCCEEDED,
  RESTORE_PREVIOUS_USER_PREFERENCES,
  SAVE_USER_PREFERENCES_STARTED,
  SAVE_USER_PREFERENCES_FAILED,
  SAVE_USER_PREFERENCES_SUCCEEDED,
  SET_USER_PREFERENCE,
  SET_DISMISSED_DASHBOARD_PREFERENCE_BENEFIT_ALERTS,
} from '../../actions';

describe('preferences actions', () => {
  describe('fetchUserSelectedBenefits', () => {
    beforeEach(() => {
      mockFetch();
    });
    afterEach(() => {
      resetFetch();
    });
    let dispatch;
    let getState;

    describe('when use selections have been cached', () => {
      test(`should do nothing and its thunk should return null`, done => {
        dispatch = sinon.spy();
        getState = sinon.stub().returns({
          preferences: {
            selectedBenefitsCached: true,
          },
        });
        const value = fetchUserSelectedBenefits()(dispatch, getState);
        expect(value).toBeNull();
        expect(dispatch.notCalled).toBe(true);
        done();
      });
    });
    describe('when user selections have not been cached', () => {
      beforeEach(() => {
        dispatch = sinon.spy();
        getState = sinon.stub().returns({
          preferences: {
            selectedBenefitsCached: false,
          },
        });
      });
      test(`should dispatch the FETCH_USER_PREFERENCES_STARTED action immediately`, done => {
        fetchUserSelectedBenefits()(dispatch, getState);

        expect(
          dispatch.firstCall.calledWith({
            type: FETCH_USER_PREFERENCES_STARTED,
          }),
        ).toBe(true);
        done();
      });

      test(`should call the API`, done => {
        fetchUserSelectedBenefits()(dispatch, getState);

        setTimeout(() => {
          expect(global.fetch.firstCall.args[0]).toEqual(
            expect.arrayContaining(['/v0/user/preferences']),
          );
          expect(global.fetch.firstCall.args[1].method).toBe('GET');
          done();
        }, 0);
      });

      test(`should dispatch the FETCH_USER_PREFERENCES_FAILED action on request failure`, done => {
        const error = { test: 'test' };
        setFetchFailure(global.fetch.onFirstCall(), error);

        fetchUserSelectedBenefits()(dispatch, getState);

        setTimeout(() => {
          expect(
            dispatch.secondCall.calledWith({
              type: FETCH_USER_PREFERENCES_FAILED,
            }),
          ).toBe(true);
          done();
        }, 0);
      });

      test(`should dispatch the FETCH_USER_PREFERENCES_SUCCEEDED action on request success`, done => {
        const response = {
          data: {
            attributes: {
              userPreferences: [
                {
                  code: 'benefits',
                  userPreferences: [
                    {
                      code: 'pensions',
                      description: 'pension benefits',
                    },
                    {
                      code: 'health-care',
                      description: 'health care benefits',
                    },
                  ],
                },
              ],
            },
          },
        };
        setFetchResponse(global.fetch.onFirstCall(), response);

        fetchUserSelectedBenefits()(dispatch, getState);

        setTimeout(() => {
          expect(dispatch.secondCall.args[0]).toEqual({
            type: FETCH_USER_PREFERENCES_SUCCEEDED,
            payload: response,
          });
          done();
        }, 0);
      });
    });
  });
  describe('fetchAvailableBenefits', () => {
    beforeEach(() => {
      mockFetch();
    });
    afterEach(() => {
      resetFetch();
    });
    let dispatch;
    let getState;

    describe('when available preferences have been cached', () => {
      test(`should do nothing and its thunk should return null`, done => {
        dispatch = sinon.spy();
        getState = sinon.stub().returns({
          preferences: {
            availableBenefitsCached: true,
          },
        });
        const value = fetchAvailableBenefits()(dispatch, getState);
        expect(value).toBeNull();
        expect(dispatch.notCalled).toBe(true);
        done();
      });
    });

    describe('when available preferences have not been cached', () => {
      beforeEach(() => {
        dispatch = sinon.spy();
        getState = sinon.stub().returns({
          preferences: {
            availableBenefitsCached: false,
          },
        });
      });
      test(`should immediately dispatch the FETCH_ALL_BENEFITS_STARTED action`, done => {
        fetchAvailableBenefits()(dispatch, getState);

        expect(
          dispatch.firstCall.calledWith({
            type: FETCH_ALL_BENEFITS_STARTED,
          }),
        ).toBe(true);

        done();
      });

      test(`should call the API`, done => {
        fetchAvailableBenefits()(dispatch, getState);

        setTimeout(() => {
          expect(global.fetch.firstCall.args[0]).toEqual(
            expect.arrayContaining(['/v0/user/preferences/choices/benefits']),
          );
          expect(global.fetch.firstCall.args[1].method).toBe('GET');
          done();
        }, 0);
      });

      test(`should dispatch the FETCH_ALL_BENEFITS_FAILED on request failure`, done => {
        const error = { test: 'test' };
        setFetchFailure(global.fetch.onFirstCall(), error);

        fetchAvailableBenefits()(dispatch, getState);

        setTimeout(() => {
          expect(
            dispatch.secondCall.calledWith({
              type: FETCH_ALL_BENEFITS_FAILED,
            }),
          ).toBe(true);
          done();
        }, 0);
      });

      test(`should dispatch the FETCH_ALL_BENEFITS_SUCCEEDED action on request success`, done => {
        const response = {
          data: {
            attributes: {
              code: 'benefits',
              title: 'Available Benefits',
              preferenceChoices: [
                {
                  code: 'pensions',
                  description: 'pension benefits',
                },
              ],
            },
          },
        };
        setFetchResponse(global.fetch.onFirstCall(), response);

        fetchAvailableBenefits()(dispatch, getState);

        setTimeout(() => {
          expect(dispatch.secondCall.args[0]).toEqual({
            type: FETCH_ALL_BENEFITS_SUCCEEDED,
            payload: response,
          });
          done();
        }, 0);
      });
    });
  });
  describe('setPreference', () => {
    test('should return a SET_USER_PREFERENCE action, setting the preference to `true` by default', () => {
      expect(setPreference('preference-code')).toEqual({
        type: SET_USER_PREFERENCE,
        code: 'preference-code',
        value: true,
      });
    });
    test('should return a SET_USER_PREFERENCE action, setting it to the correct value', () => {
      expect(setPreference('preference-code', false)).toEqual({
        type: SET_USER_PREFERENCE,
        code: 'preference-code',
        value: false,
      });
    });
  });
  describe('setDismissedBenefitAlerts', () => {
    test('should return a SET_DASHBOARD_PREFERENCE_BENEFIT_ALERTS action, setting the dismissedBenefitAlerts to `[]` by default', () => {
      expect(setDismissedBenefitAlerts()).toEqual({
        type: SET_DISMISSED_DASHBOARD_PREFERENCE_BENEFIT_ALERTS,
        value: [],
      });
    });
    test('should return a SET_DASHBOARD_PREFERENCE_BENEFIT_ALERTS action, setting it to the correct value', () => {
      const value = ['homelessness-alert'];
      expect(setDismissedBenefitAlerts(value)).toEqual({
        type: SET_DISMISSED_DASHBOARD_PREFERENCE_BENEFIT_ALERTS,
        value,
      });
    });
  });
  describe('restorePreviousSelections', () => {
    test('should return a RESTORE_PREVIOUS_USER_PREFERENCES action', () => {
      expect(restorePreviousSelections()).toEqual({
        type: RESTORE_PREVIOUS_USER_PREFERENCES,
      });
    });
  });
  describe('savePreferences', () => {
    const benefitsData = {
      pensions: true,
      burials: false,
    };
    beforeEach(() => {
      mockFetch();
    });
    afterEach(() => {
      resetFetch();
    });
    test(`should immediately dispatch the SAVE_USER_PREFERENCES_STARTED action`, done => {
      const dispatch = sinon.spy();

      savePreferences(benefitsData)(dispatch);

      expect(
        dispatch.firstCall.calledWith({
          type: SAVE_USER_PREFERENCES_STARTED,
        }),
      ).toBe(true);

      done();
    });

    test(`should call the API`, done => {
      const dispatch = sinon.spy();

      savePreferences(benefitsData)(dispatch);

      setTimeout(() => {
        expect(global.fetch.firstCall.args[0]).toEqual(
          expect.arrayContaining(['/v0/user/preferences']),
        );
        expect(global.fetch.firstCall.args[1].method).toBe('POST');
        expect(JSON.parse(global.fetch.firstCall.args[1].body)).toEqual([
          {
            preference: {
              code: 'benefits',
            },
            // eslint-disable-next-line camelcase
            user_preferences: [{ code: 'pensions' }],
          },
        ]);
        done();
      }, 0);
    });

    test(`should dispatch the SAVE_USER_PREFERENCES_FAILED action on request failure`, done => {
      const error = { test: 'test' };
      setFetchFailure(global.fetch.onFirstCall(), error);

      const dispatch = sinon.spy();

      savePreferences(benefitsData)(dispatch);

      setTimeout(() => {
        expect(
          dispatch.secondCall.calledWith({
            type: SAVE_USER_PREFERENCES_FAILED,
          }),
        ).toBe(true);
        done();
      }, 0);
    });

    test(`should dispatch the SAVE_USER_PREFERENCES_SUCCEEDED on request success`, done => {
      const response = {
        data: {
          attributes: {
            code: 'benefits',
            title: 'Available Benefits',
            preferenceChoices: [
              {
                code: 'pensions',
                description: 'pension benefits',
              },
            ],
          },
        },
      };
      setFetchResponse(global.fetch.onFirstCall(), response);

      const dispatch = sinon.spy();

      savePreferences(benefitsData)(dispatch);

      setTimeout(() => {
        expect(
          dispatch.secondCall.calledWith({
            type: SAVE_USER_PREFERENCES_SUCCEEDED,
          }),
        ).toBe(true);
        done();
      }, 0);
    });
  });
  describe('deletePreferences', () => {
    beforeEach(() => {
      mockFetch();
    });
    afterEach(() => {
      resetFetch();
    });
    test(`should immediately dispatch the SAVE_USER_PREFERENCES_STARTED action`, done => {
      const dispatch = sinon.spy();

      deletePreferences()(dispatch);

      expect(
        dispatch.firstCall.calledWith({
          type: SAVE_USER_PREFERENCES_STARTED,
        }),
      ).toBe(true);

      done();
    });

    test(`should call the API`, done => {
      const dispatch = sinon.spy();

      deletePreferences()(dispatch);

      setTimeout(() => {
        expect(global.fetch.firstCall.args[0]).toEqual(
          expect.arrayContaining(['/v0/user/preferences/benefits/delete_all']),
        );
        expect(global.fetch.firstCall.args[1].method).toBe('DELETE');
        done();
      }, 0);
    });

    test(`should dispatch the SAVE_USER_PREFERENCES_FAILED on request failure`, done => {
      const error = { test: 'test' };
      setFetchFailure(global.fetch.onFirstCall(), error);

      const dispatch = sinon.spy();

      deletePreferences()(dispatch);

      setTimeout(() => {
        expect(
          dispatch.secondCall.calledWith({
            type: SAVE_USER_PREFERENCES_FAILED,
          }),
        ).toBe(true);
        done();
      }, 0);
    });

    test(`should dispatch the SAVE_USER_PREFERENCES_SUCCEEDED`, done => {
      const response = {
        data: {
          id: 'string',
          type: 'string',
          attributes: {
            preferenceCode: 'string',
            userPreferences: [],
          },
        },
      };
      setFetchResponse(global.fetch.onFirstCall(), response);

      const dispatch = sinon.spy();

      deletePreferences()(dispatch);

      setTimeout(() => {
        expect(
          dispatch.secondCall.calledWith({
            type: SAVE_USER_PREFERENCES_SUCCEEDED,
          }),
        ).toBe(true);
        done();
      }, 0);
    });
  });

  describe('updatePreferences', () => {
    let saveSpy;
    let deleteSpy;
    beforeEach(() => {
      saveSpy = sinon.spy();
      deleteSpy = sinon.spy();
    });
    test('should call savePreferences if it is passed a non-empty array of benefits', () => {
      updatePreferences({ pref: true }, saveSpy, deleteSpy);
      expect(deleteSpy.called).not.toBe(true);
      expect(saveSpy.firstCall.calledWith({ pref: true })).toBe(true);
    });
    test('should call deletePreferences if it is passed an empty array of benefits', () => {
      updatePreferences({}, saveSpy, deleteSpy);
      expect(saveSpy.called).not.toBe(true);
      expect(deleteSpy.called).toBe(true);
    });
  });
});
