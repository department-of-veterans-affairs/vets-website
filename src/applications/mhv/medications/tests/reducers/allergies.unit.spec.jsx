import { expect } from 'chai';
import { Actions } from '../../util/actionTypes';
import { allergiesReducer } from '../../reducers/allergies';
import allergies from '../../../medical-records/tests/fixtures/allergies.json';

describe('Allergies reducer', () => {
  const initialState = {
    allergiesList: undefined,
    error: undefined,
  };
  it('should update the allergies list', () => {
    const action = {
      type: Actions.Allergies.GET_LIST,
      response: allergies,
    };
    const nextState = allergiesReducer(initialState, action);
    expect(nextState.allergiesList).to.exist;
  });

  it('should produce an empty list', () => {
    const action = {
      type: Actions.Allergies.GET_LIST,
      response: {},
    };
    const nextState = allergiesReducer(initialState, action);
    expect(nextState.allergiesList).to.exist;
  });

  it('should set the error tag to true', () => {
    const action = {
      type: Actions.Allergies.GET_LIST_ERROR,
    };
    const nextState = allergiesReducer(initialState, action);
    expect(nextState.error).to.exist;
  });

  it('should clear the error tag', () => {
    const action = {
      type: Actions.Allergies.GET_LIST_ERROR_RESET,
    };
    const nextState = allergiesReducer(initialState, action);
    expect(nextState.error).to.equal(undefined);
  });
});
