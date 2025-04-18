import { expect } from 'chai';
import {
  VERIFY_ENROLLMENT,
  VERIFY_ENROLLMENT_FAILURE,
  VERIFY_ENROLLMENT_SUCCESS,
} from '../../actions';
import verifyEnrollment from '../../reducers/verifyEnrollment';

describe('verifyEnrollment Reducer', () => {
  it('should return the initial state', () => {
    expect(verifyEnrollment(undefined, {})).to.deep.equal({
      loading: false,
      data: null,
      error: null,
    });
  });

  it('should handle VERIFY_ENROLLMENT', () => {
    const startAction = {
      type: VERIFY_ENROLLMENT,
    };
    expect(verifyEnrollment(undefined, startAction)).to.deep.equal({
      loading: true,
      data: null,
      error: null,
    });
  });

  it('should handle VERIFY_ENROLLMENT_SUCCESS', () => {
    const successAction = {
      type: VERIFY_ENROLLMENT_SUCCESS,
      response: { id: 1, data: 'verify' },
    };
    expect(verifyEnrollment(undefined, successAction)).to.deep.equal({
      loading: false,
      data: { id: 1, data: 'verify' },
      error: null,
    });
  });

  it('should handle VERIFY_ENROLLMENT_FAILURE', () => {
    const failAction = {
      type: VERIFY_ENROLLMENT_FAILURE,
      errors: 'verifying your enrollment',
    };
    expect(verifyEnrollment(undefined, failAction)).to.deep.equal({
      loading: false,
      data: null,
      error: 'verifying your enrollment',
    });
  });
});
