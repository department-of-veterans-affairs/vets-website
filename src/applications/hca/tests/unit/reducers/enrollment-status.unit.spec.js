import { expect } from 'chai';
import {
  MOCK_ENROLLMENT_RESPONSE,
  ENROLLMENT_STATUS_ACTIONS,
  ENROLLMENT_STATUS_INIT_STATE,
} from '../../../utils/constants';
import reducer from '../../../reducers/enrollment-status';

describe('hca enrollment status reducer', () => {
  let state;

  beforeEach(() => {
    state = undefined;
  });

  context('default behavior', () => {
    it('should return the initial state', () => {
      const action = {};
      const reducedState = reducer(state, action);
      expect(JSON.stringify(reducedState)).to.eq(
        JSON.stringify(ENROLLMENT_STATUS_INIT_STATE),
      );
    });
  });

  context('when the action type is not a match', () => {
    it('should return the initial state', () => {
      const action = { type: '@@INIT' };
      const reducedState = reducer(state, action);
      expect(JSON.stringify(reducedState)).to.eq(
        JSON.stringify(ENROLLMENT_STATUS_INIT_STATE),
      );
    });
  });

  context('when `FETCH_ENROLLMENT_STATUS_STARTED` executes', () => {
    const { FETCH_ENROLLMENT_STATUS_STARTED } = ENROLLMENT_STATUS_ACTIONS;

    it('should set `loading` to `true`', () => {
      const action = {
        type: FETCH_ENROLLMENT_STATUS_STARTED,
      };
      const { loading } = reducer(state, action);
      expect(loading).to.be.true;
    });
  });

  context('when `FETCH_ENROLLMENT_STATUS_SUCCEEDED` executes', () => {
    const { FETCH_ENROLLMENT_STATUS_SUCCEEDED } = ENROLLMENT_STATUS_ACTIONS;

    it('should set the correct state when `parsedStatus` is `enrolled`', () => {
      const action = {
        type: FETCH_ENROLLMENT_STATUS_SUCCEEDED,
        response: MOCK_ENROLLMENT_RESPONSE,
      };
      const reducedState = reducer(state, action);
      expect(reducedState.statusCode).to.equal(action.response.parsedStatus);
      expect(reducedState.applicationDate).to.equal(
        action.response.applicationDate,
      );
      expect(reducedState.enrollmentDate).to.equal(
        action.response.enrollmentDate,
      );
      expect(reducedState.preferredFacility).to.equal(
        action.response.preferredFacility,
      );
      expect(reducedState.loading).to.be.false;
      expect(reducedState.isUserInMPI).to.be.true;
    });
  });

  context('when `FETCH_ENROLLMENT_STATUS_FAILED` executes', () => {
    const { FETCH_ENROLLMENT_STATUS_FAILED } = ENROLLMENT_STATUS_ACTIONS;

    it('should set the correct state when the error code is `404`', () => {
      const action = {
        type: FETCH_ENROLLMENT_STATUS_FAILED,
        errors: [{ code: '404' }],
      };
      const { hasServerError, hasRateLimitError } = reducer(state, action);
      expect(hasRateLimitError).to.be.false;
      expect(hasServerError).to.be.false;
    });

    it('should set the correct state when the error code is `429`', () => {
      const action = {
        type: FETCH_ENROLLMENT_STATUS_FAILED,
        errors: [{ code: '429' }],
      };
      const { hasServerError, hasRateLimitError } = reducer(state, action);
      expect(hasRateLimitError).to.be.true;
      expect(hasServerError).to.be.false;
    });

    it('should set the correct state when the error code is in the 500s', () => {
      const action = {
        type: FETCH_ENROLLMENT_STATUS_FAILED,
        errors: [{ code: '500' }],
      };
      const { hasServerError, hasRateLimitError } = reducer(state, action);
      expect(hasRateLimitError).to.be.false;
      expect(hasServerError).to.be.true;
    });

    it('should set the correct state when error code is not 404, 429 or in the 500s', () => {
      const action = {
        type: FETCH_ENROLLMENT_STATUS_FAILED,
        errors: [{ code: '403' }],
      };
      const { hasServerError, hasRateLimitError } = reducer(state, action);
      expect(hasRateLimitError).to.be.false;
      expect(hasServerError).to.be.true;
    });
  });

  context('when `RESET_ENROLLMENT_STATUS` executes', () => {
    const { RESET_ENROLLMENT_STATUS } = ENROLLMENT_STATUS_ACTIONS;

    it('should reset enrollment data', () => {
      const action = {
        type: RESET_ENROLLMENT_STATUS,
      };
      const {
        applicationDate,
        enrollmentDate,
        preferredFacility,
        statusCode,
      } = reducer(state, action);
      expect(applicationDate).to.be.null;
      expect(enrollmentDate).to.be.null;
      expect(preferredFacility).to.be.null;
      expect(statusCode).to.be.null;
    });

    it('should reset user lookup values', () => {
      const action = { type: RESET_ENROLLMENT_STATUS };
      const { isUserInMPI } = reducer(state, action);
      expect(isUserInMPI).to.be.false;
    });

    it('should reset loading and error values', () => {
      const action = { type: RESET_ENROLLMENT_STATUS };
      const { hasServerError, loading } = reducer(state, action);
      expect(hasServerError).to.be.false;
      expect(loading).to.be.false;
    });
  });
});
