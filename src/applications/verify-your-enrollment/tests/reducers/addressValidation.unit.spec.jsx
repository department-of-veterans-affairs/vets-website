import { expect } from 'chai';
import addressReducer from '../../reducers/addressValidation';

describe('addressReducer', () => {
  it('should handle ADDRESS_VALIDATION_START', () => {
    const initialState = {
      isLoadingValidateAddress: false,
      validationError: null,
      validationSuccess: false,
      addressValidationData: null,
    };
    const action = {
      type: 'ADDRESS_VALIDATION_START',
    };
    const newState = addressReducer(initialState, action);
    expect(newState.isLoadingValidateAddress).to.be.true;
    expect(newState.validationError).to.be.null;
    expect(newState.validationSuccess).to.be.false;
    expect(newState.addressValidationData).to.be.null;
  });

  it('should handle ADDRESS_VALIDATION_SUCCESS', () => {
    const initialState = {
      isLoadingValidateAddress: true,
      validationError: null,
      validationSuccess: false,
      addressValidationData: null,
    };
    const action = {
      type: 'ADDRESS_VALIDATION_SUCCESS',
      payload: { address: '123 Main St' },
    };
    const newState = addressReducer(initialState, action);
    expect(newState.isLoadingValidateAddress).to.be.false;
    expect(newState.validationError).to.be.null;
    expect(newState.validationSuccess).to.be.true;
    expect(newState.addressValidationData).to.deep.equal({
      address: '123 Main St',
    });
  });
  it('Should handle RESET_ADDRESS_VALIDATIONS_ERROR', () => {
    const initialState = {
      validationError: 'some error',
    };
    const action = {
      type: 'RESET_ADDRESS_VALIDATIONS_ERROR',
    };
    const newState = addressReducer(initialState, action);
    expect(newState.validationError).to.be.null;
  });
  it('should handle ADDRESS_VALIDATION_FAIL', () => {
    const initialState = {
      isLoadingValidateAddress: true,
      validationError: null,
      validationSuccess: false,
      addressValidationData: null,
    };
    const action = {
      type: 'ADDRESS_VALIDATION_FAIL',
      payload: 'Validation failed',
    };
    const newState = addressReducer(initialState, action);
    expect(newState.isLoadingValidateAddress).to.be.false;
    expect(newState.validationError).to.equal('Validation failed');
    expect(newState.validationSuccess).to.be.false;
    expect(newState.addressValidationData).to.be.null;
  });

  it('should handle RESET_ADDRESS_VALIDATIONS', () => {
    const initialState = {
      isLoadingValidateAddress: true,
      validationSuccess: true,
      addressValidationData: { address: '123 Main St' },
    };
    const action = {
      type: 'RESET_ADDRESS_VALIDATIONS',
    };
    const newState = addressReducer(initialState, action);
    expect(newState.isLoadingValidateAddress).to.be.false;
    expect(newState.validationSuccess).to.be.false;
    expect(newState.addressValidationData).to.be.null;
  });

  it('should return the current state for unknown action types', () => {
    const initialState = {
      isLoadingValidateAddress: false,
      validationError: null,
      validationSuccess: false,
      addressValidationData: null,
    };
    const action = {
      type: 'UNKNOWN_ACTION',
    };
    const newState = addressReducer(initialState, action);
    expect(newState).to.deep.equal(initialState);
  });
});
