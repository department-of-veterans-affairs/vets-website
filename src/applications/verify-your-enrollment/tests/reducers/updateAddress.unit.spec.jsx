import { expect } from 'chai';
import {
  UPDATE_ADDRESS,
  UPDATE_ADDRESS_FAILURE,
  UPDATE_ADDRESS_SUCCESS,
} from '../../actions';
import updateAddress from '../../reducers/updateAddress';

describe('bankInfo Reducer', () => {
  it('should return the initial state', () => {
    expect(updateAddress(undefined, {})).to.deep.equal({
      loading: false,
      data: null,
      error: null,
    });
  });

  it('should handle UPDATE_BANK_INFO', () => {
    const startAction = {
      type: UPDATE_ADDRESS,
    };
    expect(updateAddress(undefined, startAction)).to.deep.equal({
      loading: true,
      data: null,
      error: null,
    });
  });

  it('should handle UPDATE_BANK_INFO_SUCCESS', () => {
    const successAction = {
      type: UPDATE_ADDRESS_SUCCESS,
      response: { id: 1, address: 'Test address' },
    };
    expect(updateAddress(undefined, successAction)).to.deep.equal({
      loading: false,
      data: { id: 1, address: 'Test address' },
      error: null,
    });
  });

  it('should handle UPDATE_BANK_INFO_FAILED', () => {
    const failAction = {
      type: UPDATE_ADDRESS_FAILURE,
      errors: 'Error updating address',
    };
    expect(updateAddress(undefined, failAction)).to.deep.equal({
      loading: false,
      data: null,
      error: 'Error updating address',
    });
  });

  it('should handle RESET_SUCCESS_MESSAGE', () => {
    const resetSuccessAction = {
      type: 'RESET_SUCCESS_MESSAGE',
    };
    const initialStateWithData = {
      loading: false,
      data: { id: 1, address: 'Test address' },
      error: null,
    };
    expect(
      updateAddress(initialStateWithData, resetSuccessAction),
    ).to.deep.equal({
      loading: false,
      data: null,
      error: null,
    });
  });

  it('should handle RESET_ERROR', () => {
    const resetErrorAction = {
      type: 'RESET_ERROR',
    };
    const initialStateWithError = {
      loading: false,
      data: null,
      error: 'Error updating bank info',
    };
    expect(
      updateAddress(initialStateWithError, resetErrorAction),
    ).to.deep.equal({
      loading: false,
      data: null,
      error: null,
    });
  });
});
