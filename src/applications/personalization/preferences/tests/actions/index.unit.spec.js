import { expect } from 'chai';
import sinon from 'sinon';
import { mockFetch, resetFetch } from 'platform/testing/unit/helpers.js';
import {
  fetchAvailableBenefits,
  savePreferences,
  fetchUserSelectedBenefits,
  setPreference,
  SET_DASHBOARD_PREFERENCE,
  SET_USER_PREFERENCE_REQUEST_STATUS,
  SET_ALL_PREFERENCE_OPTIONS_REQUEST_STATUS,
  SET_SAVE_PREFERENCES_REQUEST_STATUS,
  SET_AVAILABLE_BENEFITS,
  SET_DASHBOARD_USER_PREFERENCES,
  SAVED_DASHBOARD_PREFERENCES,
} from '../../actions';
import { LOADING_STATES } from '../../constants';

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
  describe('setPreference', () => {
    it('should return a SET_DASHBOARD_PREFERENCE action, setting the preference to `true` by default', () => {
      expect(setPreference('preference-code')).to.eql({
        type: SET_DASHBOARD_PREFERENCE,
        code: 'preference-code',
        value: true,
      });
    });
    it('should return a SET_DASHBOARD_PREFERENCE action, setting it to the correct value', () => {
      expect(setPreference('preference-code', false)).to.eql({
        type: SET_DASHBOARD_PREFERENCE,
        code: 'preference-code',
        value: false,
      });
    });
  });

  describe('fetchUserSelectedBenefits', () => {
    beforeEach(() => {
      mockFetch();
    });
    afterEach(() => {
      resetFetch();
    });
    it(`should dispatch the SET_USER_PREFERENCE_REQUEST_STATUS action with 'pending' immediately`, done => {
      const dispatch = sinon.spy();

      fetchUserSelectedBenefits()(dispatch);

      expect(
        dispatch.firstCall.calledWith({
          type: SET_USER_PREFERENCE_REQUEST_STATUS,
          status: LOADING_STATES.pending,
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

    it(`should dispatch the SET_USER_PREFERENCE_REQUEST_STATUS action with 'error' on request failure`, done => {
      const error = { test: 'test' };
      setFetchFailure(global.fetch.onFirstCall(), error);

      const dispatch = sinon.spy();

      fetchUserSelectedBenefits()(dispatch);

      setTimeout(() => {
        expect(
          dispatch.secondCall.calledWith({
            type: SET_USER_PREFERENCE_REQUEST_STATUS,
            status: LOADING_STATES.error,
          }),
        ).to.be.true;
        done();
      }, 0);
    });

    it(`should dispatch the SET_DASHBOARD_USER_PREFERENCES action with the response on request success`, done => {
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
          type: SET_DASHBOARD_USER_PREFERENCES,
          payload: response,
        });
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
    it(`should immediately dispatch the SET_ALL_PREFERENCE_OPTIONS_REQUEST_STATUS action with 'pending'`, done => {
      const dispatch = sinon.spy();

      fetchAvailableBenefits()(dispatch);

      expect(
        dispatch.firstCall.calledWith({
          type: SET_ALL_PREFERENCE_OPTIONS_REQUEST_STATUS,
          status: LOADING_STATES.pending,
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

    it(`should dispatch the SET_ALL_PREFERENCE_OPTIONS_REQUEST_STATUS action with 'error' on request failure`, done => {
      const error = { test: 'test' };
      setFetchFailure(global.fetch.onFirstCall(), error);

      const dispatch = sinon.spy();

      fetchAvailableBenefits()(dispatch);

      setTimeout(() => {
        expect(
          dispatch.secondCall.calledWith({
            type: SET_ALL_PREFERENCE_OPTIONS_REQUEST_STATUS,
            status: LOADING_STATES.error,
          }),
        ).to.be.true;
        done();
      }, 0);
    });

    it(`should dispatch the SET_ALL_PREFERENCE_OPTIONS_REQUEST_STATUS action with 'loaded' and the SET_AVAILABLE_BENEFITS action on request success`, done => {
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
            type: SET_ALL_PREFERENCE_OPTIONS_REQUEST_STATUS,
            status: LOADING_STATES.loaded,
          }),
        ).to.be.true;
        done();
      }, 0);
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
    it(`should immediately dispatch the SET_SAVE_PREFERENCES_REQUEST_STATUS action with 'pending'`, done => {
      const dispatch = sinon.spy();

      savePreferences(benefitsData)(dispatch);

      expect(
        dispatch.firstCall.calledWith({
          type: SET_SAVE_PREFERENCES_REQUEST_STATUS,
          status: LOADING_STATES.pending,
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

    it(`should dispatch the SET_SAVE_PREFERENCES_REQUEST_STATUS action with 'error' on request failure`, done => {
      const error = { test: 'test' };
      setFetchFailure(global.fetch.onFirstCall(), error);

      const dispatch = sinon.spy();

      savePreferences(benefitsData)(dispatch);

      setTimeout(() => {
        expect(
          dispatch.secondCall.calledWith({
            type: SET_SAVE_PREFERENCES_REQUEST_STATUS,
            status: LOADING_STATES.error,
          }),
        ).to.be.true;
        done();
      }, 0);
    });

    it(`should dispatch the SET_SAVE_PREFERENCES_REQUEST_STATUS action with 'loaded' and the SAVED_DASHBOARD_PREFERENCES action on request success`, done => {
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
        expect(dispatch.secondCall.args[0]).to.eql({
          type: SAVED_DASHBOARD_PREFERENCES,
        });
        expect(
          dispatch.thirdCall.calledWith({
            type: SET_SAVE_PREFERENCES_REQUEST_STATUS,
            status: LOADING_STATES.loaded,
          }),
        ).to.be.true;
        done();
      }, 0);
    });
  });
});
