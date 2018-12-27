import { expect } from 'chai';
import sinon from 'sinon';
import { mockFetch, resetFetch } from 'platform/testing/unit/helpers.js';
import {
  fetchAvailableBenefits,
  savePreferences,
  fetchUserSelectedBenefits,
  setPreference,
  setDismissedBenefitAlerts,
  deletePreferences,
  FETCH_ALL_PREFERENCES_PENDING,
  FETCH_ALL_PREFERENCES_FAILED,
  FETCH_ALL_PREFERENCES_SUCCEEDED,
  FETCH_USER_PREFERENCES_PENDING,
  FETCH_USER_PREFERENCES_FAILED,
  FETCH_USER_PREFERENCES_SUCCEEDED,
  SAVE_USER_PREFERENCES_PENDING,
  SAVE_USER_PREFERENCES_FAILED,
  SAVE_USER_PREFERENCES_SUCCEEDED,
  SET_USER_PREFERENCE,
  SET_ALL_USER_PREFERENCES,
  SET_AVAILABLE_BENEFITS,
  SET_DISMISSED_DASHBOARD_PREFERENCE_BENEFIT_ALERTS,
} from '../../actions';

function setFetchResponse(stub, data) {
  const response = new Response(null, {
    headers: { 'content-type': ['application/json'] },
  });
  response.ok = true;
  response.json = () => Promise.resolve(data);
  stub.resolves(response);
}

function setFetchFailure(stub, data) {
  const response = new Response(null, {
    headers: { 'content-type': ['application/json'] },
  });
  response.ok = false;
  response.json = () => Promise.resolve(data);
  stub.resolves(response);
}

describe('preferences actions', () => {
  describe('fetchUserSelectedBenefits', () => {
    beforeEach(() => {
      mockFetch();
    });
    afterEach(() => {
      resetFetch();
    });
    it(`should dispatch the FETCH_USER_PREFERENCES_PENDING action immediately`, done => {
      const dispatch = sinon.spy();

      fetchUserSelectedBenefits()(dispatch);

      expect(
        dispatch.firstCall.calledWith({
          type: FETCH_USER_PREFERENCES_PENDING,
        }),
      ).to.be.true;
      done();
    });

    it(`should call the API`, done => {
      const dispatch = sinon.spy();

      fetchUserSelectedBenefits()(dispatch);

      setTimeout(() => {
        expect(global.fetch.firstCall.args[0]).to.contain(
          '/v0/user/preferences',
        );
        expect(global.fetch.firstCall.args[1].method).to.eql('GET');
        done();
      }, 0);
    });

    it(`should dispatch the FETCH_USER_PREFERENCES_FAILED action on request failure`, done => {
      const error = { test: 'test' };
      setFetchFailure(global.fetch.onFirstCall(), error);

      const dispatch = sinon.spy();

      fetchUserSelectedBenefits()(dispatch);

      setTimeout(() => {
        expect(
          dispatch.secondCall.calledWith({
            type: FETCH_USER_PREFERENCES_FAILED,
          }),
        ).to.be.true;
        done();
      }, 0);
    });

    it(`should dispatch the FETCH_USER_PREFERENCES_SUCCEEDED and SET_ALL_USER_PREFERENCES actions on request success`, done => {
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

      const dispatch = sinon.spy();

      fetchUserSelectedBenefits()(dispatch);

      setTimeout(() => {
        expect(dispatch.secondCall.args[0]).to.eql({
          type: SET_ALL_USER_PREFERENCES,
          payload: response,
        });
        expect(
          dispatch.thirdCall.calledWith({
            type: FETCH_USER_PREFERENCES_SUCCEEDED,
          }),
        ).to.be.true;
        done();
      }, 0);
    });
  });
  describe('fetchAvailableBenefits', () => {
    beforeEach(() => {
      mockFetch();
    });
    afterEach(() => {
      resetFetch();
    });
    it(`should immediately dispatch the FETCH_ALL_PREFERENCES_PENDING action`, done => {
      const dispatch = sinon.spy();

      fetchAvailableBenefits()(dispatch);

      expect(
        dispatch.firstCall.calledWith({
          type: FETCH_ALL_PREFERENCES_PENDING,
        }),
      ).to.be.true;

      done();
    });

    it(`should call the API`, done => {
      const dispatch = sinon.spy();

      fetchAvailableBenefits()(dispatch);

      setTimeout(() => {
        expect(global.fetch.firstCall.args[0]).to.contain(
          '/v0/user/preferences/choices/benefits',
        );
        expect(global.fetch.firstCall.args[1].method).to.eql('GET');
        done();
      }, 0);
    });

    it(`should dispatch the FETCH_ALL_PREFERENCES_FAILED on request failure`, done => {
      const error = { test: 'test' };
      setFetchFailure(global.fetch.onFirstCall(), error);

      const dispatch = sinon.spy();

      fetchAvailableBenefits()(dispatch);

      setTimeout(() => {
        expect(
          dispatch.secondCall.calledWith({
            type: FETCH_ALL_PREFERENCES_FAILED,
          }),
        ).to.be.true;
        done();
      }, 0);
    });

    it(`should dispatch the FETCH_ALL_PREFERENCES_SUCCEEDED and the SET_AVAILABLE_BENEFITS actions on request success`, done => {
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

      fetchAvailableBenefits()(dispatch);

      setTimeout(() => {
        expect(dispatch.secondCall.args[0]).to.eql({
          type: SET_AVAILABLE_BENEFITS,
          preferences: [{ code: 'pensions', description: 'pension benefits' }],
        });
        expect(
          dispatch.thirdCall.calledWith({
            type: FETCH_ALL_PREFERENCES_SUCCEEDED,
          }),
        ).to.be.true;
        done();
      }, 0);
    });
  });
  describe('setPreference', () => {
    it('should return a SET_USER_PREFERENCE action, setting the preference to `true` by default', () => {
      expect(setPreference('preference-code')).to.eql({
        type: SET_USER_PREFERENCE,
        code: 'preference-code',
        value: true,
      });
    });
    it('should return a SET_USER_PREFERENCE action, setting it to the correct value', () => {
      expect(setPreference('preference-code', false)).to.eql({
        type: SET_USER_PREFERENCE,
        code: 'preference-code',
        value: false,
      });
    });
  });
  describe('setDismissedBenefitAlerts', () => {
    it('should return a SET_DASHBOARD_PREFERENCE_BENEFIT_ALERTS action, setting the dismissedBenefitAlerts to `[]` by default', () => {
      expect(setDismissedBenefitAlerts()).to.eql({
        type: SET_DISMISSED_DASHBOARD_PREFERENCE_BENEFIT_ALERTS,
        value: [],
      });
    });
    it('should return a SET_DASHBOARD_PREFERENCE_BENEFIT_ALERTS action, setting it to the correct value', () => {
      const value = ['homelessness-alert'];
      expect(setDismissedBenefitAlerts(value)).to.eql({
        type: SET_DISMISSED_DASHBOARD_PREFERENCE_BENEFIT_ALERTS,
        value,
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
    it(`should immediately dispatch the SAVE_USER_PREFERENCES_PENDING action`, done => {
      const dispatch = sinon.spy();

      savePreferences(benefitsData)(dispatch);

      expect(
        dispatch.firstCall.calledWith({
          type: SAVE_USER_PREFERENCES_PENDING,
        }),
      ).to.be.true;

      done();
    });

    it(`should call the API`, done => {
      const dispatch = sinon.spy();

      savePreferences(benefitsData)(dispatch);

      setTimeout(() => {
        expect(global.fetch.firstCall.args[0]).to.contain(
          '/v0/user/preferences',
        );
        expect(global.fetch.firstCall.args[1].method).to.eql('POST');
        expect(JSON.parse(global.fetch.firstCall.args[1].body)).to.eql([
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

    it(`should dispatch the SAVE_USER_PREFERENCES_FAILED action on request failure`, done => {
      const error = { test: 'test' };
      setFetchFailure(global.fetch.onFirstCall(), error);

      const dispatch = sinon.spy();

      savePreferences(benefitsData)(dispatch);

      setTimeout(() => {
        expect(
          dispatch.secondCall.calledWith({
            type: SAVE_USER_PREFERENCES_FAILED,
          }),
        ).to.be.true;
        done();
      }, 0);
    });

    it(`should dispatch the SAVE_USER_PREFERENCES_SUCCEEDED on request success`, done => {
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
        ).to.be.true;
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
    it(`should immediately dispatch the SAVE_USER_PREFERENCES_PENDING action`, done => {
      const dispatch = sinon.spy();

      deletePreferences()(dispatch);

      expect(
        dispatch.firstCall.calledWith({
          type: SAVE_USER_PREFERENCES_PENDING,
        }),
      ).to.be.true;

      done();
    });

    it(`should call the API`, done => {
      const dispatch = sinon.spy();

      deletePreferences()(dispatch);

      setTimeout(() => {
        expect(global.fetch.firstCall.args[0]).to.contain(
          '/v0/user/preferences/benefits/delete_all',
        );
        expect(global.fetch.firstCall.args[1].method).to.eql('DELETE');
        done();
      }, 0);
    });

    it(`should dispatch the SAVE_USER_PREFERENCES_FAILED on request failure`, done => {
      const error = { test: 'test' };
      setFetchFailure(global.fetch.onFirstCall(), error);

      const dispatch = sinon.spy();

      deletePreferences()(dispatch);

      setTimeout(() => {
        expect(
          dispatch.secondCall.calledWith({
            type: SAVE_USER_PREFERENCES_FAILED,
          }),
        ).to.be.true;
        done();
      }, 0);
    });

    it(`should dispatch the SAVE_USER_PREFERENCES_SUCCEEDED`, done => {
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
        ).to.be.true;
        done();
      }, 0);
    });
  });
});
