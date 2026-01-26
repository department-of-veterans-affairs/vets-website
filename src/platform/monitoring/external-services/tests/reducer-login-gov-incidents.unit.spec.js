import { expect } from 'chai';
import externalServiceStatuses from '../../../monitoring/external-services/reducer';
import {
  LOADING_LOGIN_GOV_STATE_INCIDENTS,
  FETCH_LOGIN_GOV_STATE_INCIDENTS_SUCCESS,
  FETCH_LOGIN_GOV_STATE_INCIDENTS_FAILURE,
} from '../../../monitoring/external-services/actions';

describe('external services reducer - login.gov state incidents', () => {
  const initialState = {
    loading: false,
    statuses: null,
    maintenanceWindows: [],
    loginGovStateIncidents: {
      loading: false,
      incidents: [],
      error: null,
    },
  };

  it('should handle LOADING_LOGIN_GOV_STATE_INCIDENTS', () => {
    const action = { type: LOADING_LOGIN_GOV_STATE_INCIDENTS };
    const state = externalServiceStatuses(initialState, action);

    expect(state.loginGovStateIncidents.loading).to.be.true;
    expect(state.loginGovStateIncidents.incidents).to.deep.equal([]);
  });

  it('should handle FETCH_LOGIN_GOV_STATE_INCIDENTS_SUCCESS', () => {
    const incidents = [
      {
        id: '123',
        active: true,
        states: ['AR', 'TX'],
        title: 'Arkansas Maintenance',
        message: 'Login.gov is down in Arkansas',
        status: 'warning',
      },
    ];

    const action = {
      type: FETCH_LOGIN_GOV_STATE_INCIDENTS_SUCCESS,
      data: {
        attributes: { incidents },
      },
    };

    const state = externalServiceStatuses(initialState, action);

    expect(state.loginGovStateIncidents.loading).to.be.false;
    expect(state.loginGovStateIncidents.incidents).to.deep.equal(incidents);
    expect(state.loginGovStateIncidents.error).to.be.null;
  });

  it('should handle FETCH_LOGIN_GOV_STATE_INCIDENTS_SUCCESS with empty incidents', () => {
    const action = {
      type: FETCH_LOGIN_GOV_STATE_INCIDENTS_SUCCESS,
      data: {
        attributes: {},
      },
    };

    const state = externalServiceStatuses(initialState, action);

    expect(state.loginGovStateIncidents.incidents).to.deep.equal([]);
  });

  it('should handle FETCH_LOGIN_GOV_STATE_INCIDENTS_FAILURE', () => {
    const action = { type: FETCH_LOGIN_GOV_STATE_INCIDENTS_FAILURE };
    const state = externalServiceStatuses(initialState, action);

    expect(state.loginGovStateIncidents.loading).to.be.false;
    expect(state.loginGovStateIncidents.incidents).to.deep.equal([]);
    expect(state.loginGovStateIncidents.error).to.be.true;
  });

  it('should preserve other state when handling login.gov incidents', () => {
    const customState = {
      ...initialState,
      statuses: [{ serviceId: 'mvi', status: 'active' }],
      maintenanceWindows: [{ service: 'test' }],
    };

    const action = {
      type: FETCH_LOGIN_GOV_STATE_INCIDENTS_SUCCESS,
      data: {
        attributes: { incidents: [] },
      },
    };

    const state = externalServiceStatuses(customState, action);

    expect(state.statuses).to.deep.equal(customState.statuses);
    expect(state.maintenanceWindows).to.deep.equal(
      customState.maintenanceWindows,
    );
  });
});
