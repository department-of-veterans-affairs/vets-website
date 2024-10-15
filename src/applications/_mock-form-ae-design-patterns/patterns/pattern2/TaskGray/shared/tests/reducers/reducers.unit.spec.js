import { expect } from 'chai';

import { UPDATE_LOGGEDIN_STATUS } from 'platform/user/authentication/actions';

import { CALLSTATUS } from '../../constants';
import {
  GENERATE_AUTOMATIC_COE_STARTED,
  GENERATE_AUTOMATIC_COE_FAILED,
  GENERATE_AUTOMATIC_COE_SUCCEEDED,
  SKIP_AUTOMATIC_COE_CHECK,
} from '../../actions';

import reducers, { initialState } from '../../reducers';

describe('certificateOfEligibility reducer', () => {
  const { certificateOfEligibility } = reducers;

  it('should handle UPDATE_LOGGEDIN_STATUS', () => {
    const newState = certificateOfEligibility(initialState, {
      type: UPDATE_LOGGEDIN_STATUS,
    });
    expect(newState.profileIsUpdating).to.be.false;
  });

  it('should handle SKIP_AUTOMATIC_COE_CHECK', () => {
    const newState = certificateOfEligibility(initialState, {
      type: SKIP_AUTOMATIC_COE_CHECK,
    });
    expect(newState.generateAutoCoeStatus).to.equal(CALLSTATUS.skip);
    expect(newState.isLoading).to.equal(false);
  });

  it('should handle GENERATE_AUTOMATIC_COE_STARTED', () => {
    const newState = certificateOfEligibility(initialState, {
      type: GENERATE_AUTOMATIC_COE_STARTED,
    });
    expect(newState.generateAutoCoeStatus).to.equal(CALLSTATUS.pending);
  });

  it('should handle GENERATE_AUTOMATIC_COE_FAILED', () => {
    const errors = 'mock_COE_error';
    const newState = certificateOfEligibility(initialState, {
      type: GENERATE_AUTOMATIC_COE_FAILED,
      response: { errors },
    });
    expect(newState.generateAutoCoeStatus).to.equal(CALLSTATUS.failed);
    expect(newState.errors.coe).to.equal(errors);
    expect(newState.isLoading).to.equal(false);
  });

  it('should handle GENERATE_AUTOMATIC_COE_SUCCEEDED', () => {
    const response = 'mock_COE_success';
    const newState = certificateOfEligibility(initialState, {
      type: GENERATE_AUTOMATIC_COE_SUCCEEDED,
      response,
    });
    expect(newState.generateAutoCoeStatus).to.equal(CALLSTATUS.success);
    expect(newState.coe).to.equal(response);
    expect(newState.isLoading).to.equal(false);
  });
});
