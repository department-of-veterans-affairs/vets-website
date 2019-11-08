import { expect } from 'chai';
import registrationReducer from '../../reducers/registration';
import {
  REGISTRATION_CHECK,
  REGISTRATION_CHECK_SUCCEEDED,
  REGISTRATION_CHECK_FAILED,
} from '../../actions/registration';

import { FETCH_STATUS } from '../../utils/constants';

const initialState = {};

describe('VAOS reducer: registration', () => {
  it('should set loading state', () => {
    const action = {
      type: REGISTRATION_CHECK,
    };
    const newState = registrationReducer(initialState, action);

    expect(newState.status).to.equal(FETCH_STATUS.loading);
  });

  it('should set error state', () => {
    const action = {
      type: REGISTRATION_CHECK_FAILED,
    };
    const newState = registrationReducer(initialState, action);

    expect(newState.status).to.equal(FETCH_STATUS.failed);
  });

  it('should not pass checks if no icn or dfn', () => {
    const action = {
      type: REGISTRATION_CHECK_SUCCEEDED,
      systemIds: [],
    };
    const newState = registrationReducer(initialState, action);

    expect(newState.status).to.equal(FETCH_STATUS.succeeded);
    expect(newState.isEnrolled).to.be.false;
    expect(newState.hasRegisteredSystems).to.be.false;
  });

  it('should pass checks if icn and dfn', () => {
    const action = {
      type: REGISTRATION_CHECK_SUCCEEDED,
      systemIds: [
        { assigningAuthority: 'ICN' },
        { assigningAuthority: 'dfn-434' },
      ],
    };
    const newState = registrationReducer(initialState, action);

    expect(newState.status).to.equal(FETCH_STATUS.succeeded);
    expect(newState.isEnrolled).to.be.true;
    expect(newState.hasRegisteredSystems).to.be.true;
  });
});
