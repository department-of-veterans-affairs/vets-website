import { expect } from 'chai';

import reducer, { initialState } from '../../../reducers/form-load';
import {
  formLoadingInitiated,
  formLoadingSucceeded,
  formLoadingFailed,
} from '../../../actions/form-load';

describe('form-load reducer', () => {
  it('should return the initial state', () => {
    expect(reducer.formLoad(undefined, {})).to.deep.equal(initialState);
  });

  it('should handle FORM_LOADING_INITIATED', () => {
    const action = formLoadingInitiated('123-abc');
    const expectedState = {
      ...initialState,
      isLoading: true,
      isError: false,
      error: null,
      isSuccess: false,
      formId: action.formId,
      formConfig: null,
    };
    expect(reducer.formLoad(initialState, action)).to.deep.equal(expectedState);
  });

  it('should handle FORM_LOADING_SUCCEEDED', () => {
    const action = formLoadingSucceeded({
      someKey: 'someValue',
    });
    const currentState = {
      ...initialState,
      isLoading: true,
      isError: false,
      isSuccess: false,
      error: null,
      formId: '123-abc',
      formConfig: null,
    };
    const expectedState = {
      ...currentState,
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
      formId: '123-abc',
      formConfig: action.formConfig,
    };
    expect(reducer.formLoad(currentState, action)).to.deep.equal(expectedState);
  });

  it('should handle FORM_LOADING_FAILED', () => {
    const action = formLoadingFailed('some error');
    const currentState = {
      ...initialState,
      isLoading: true,
      isError: false,
      isSuccess: false,
      error: null,
      formId: 'bad-form-id',
      formConfig: null,
    };
    const expectedState = {
      ...currentState,
      isLoading: false,
      isError: true,
      isSuccess: false,
      error: action.error,
      formId: 'bad-form-id',
      formConfig: null,
    };
    expect(reducer.formLoad(currentState, action)).to.deep.equal(expectedState);
  });
});
