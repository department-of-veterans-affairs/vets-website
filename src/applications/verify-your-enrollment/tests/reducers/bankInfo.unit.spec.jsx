import { expect } from 'chai';
import {
  UPDATE_BANK_INFO,
  UPDATE_BANK_INFO_FAILED,
  UPDATE_BANK_INFO_SUCCESS,
} from '../../actions';
import bankInfo from '../../reducers/bankInfo';

describe('bankInfo Reducer', () => {
  it('should return the initial state', () => {
    expect(bankInfo(undefined, {})).to.deep.equal({
      loading: false,
      data: null,
      error: null,
    });
  });

  it('should handle UPDATE_BANK_INFO', () => {
    const startAction = {
      type: UPDATE_BANK_INFO,
    };
    expect(bankInfo(undefined, startAction)).to.deep.equal({
      loading: true,
      data: null,
      error: null,
    });
  });

  it('should handle UPDATE_BANK_INFO_SUCCESS', () => {
    const successAction = {
      type: UPDATE_BANK_INFO_SUCCESS,
      response: { id: 1, name: 'Test Bank' },
    };
    expect(bankInfo(undefined, successAction)).to.deep.equal({
      loading: false,
      data: { id: 1, name: 'Test Bank' },
      error: null,
    });
  });

  it('should handle UPDATE_BANK_INFO_FAILED', () => {
    const failAction = {
      type: UPDATE_BANK_INFO_FAILED,
      errors: 'Error updating bank info',
    };
    expect(bankInfo(undefined, failAction)).to.deep.equal({
      loading: false,
      data: null,
      error: 'Error updating bank info',
    });
  });

  it('should handle RESET_SUCCESS_MESSAGE', () => {
    const resetSuccessAction = {
      type: 'RESET_SUCCESS_MESSAGE',
    };
    const initialStateWithData = {
      loading: false,
      data: { id: 1, name: 'Test Bank' },
      error: null,
    };
    expect(bankInfo(initialStateWithData, resetSuccessAction)).to.deep.equal({
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
    expect(bankInfo(initialStateWithError, resetErrorAction)).to.deep.equal({
      loading: false,
      data: null,
      error: null,
    });
  });
});
