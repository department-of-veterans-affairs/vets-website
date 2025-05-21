import { expect } from 'chai';
import vaFileNumber from '../../reducers';

const initialState = {
  hasVaFileNumber: null,
  isLoading: true,
};

describe('verifyVaFileNumber reducer', () => {
  it('should return initial state', () => {
    const state = vaFileNumber.vaFileNumber(initialState, {});
    expect(state.hasVaFileNumber).to.equal(null);
  });

  it('should handle a successful check for VA file number', () => {
    const state = vaFileNumber.vaFileNumber(initialState, {
      type: 'VERIFY_VA_FILE_NUMBER_SUCCEEDED',
      response: {
        attributes: {
          code: 200,
          hasNumber: true,
        },
      },
    });
    expect(state.hasVaFileNumber.attributes.hasNumber);
  });

  it('should handle an error response from the backend', () => {
    const state = vaFileNumber.vaFileNumber(initialState, {
      type: 'VERIFY_VA_FILE_NUMBER_FAILED',
      response: {
        errors: [
          {
            code: 404,
            msg: 'No va file number found',
          },
        ],
      },
    });
    expect(state.hasVaFileNumber.errors[0].code).to.equal(404);
  });
});
