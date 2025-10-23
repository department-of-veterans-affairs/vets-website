import { expect } from 'chai';
import institutionProgramsReducer from '../../reducers/institutionPrograms';
import {
  FETCH_INSTITUTION_PROGRAMS_STARTED,
  FETCH_INSTITUTION_PROGRAMS_FAILED,
  FETCH_INSTITUTION_PROGRAMS_SUCCEEDED,
} from '../../actions';

describe('institutionProgramsReducer', () => {
  const initialState = {
    institutionPrograms: [],
    loading: false,
    error: null,
  };

  it('should return the initial state by default', () => {
    const result = institutionProgramsReducer(undefined, {});
    expect(result).to.eql(initialState);
  });

  it('should handle FETCH_INSTITUTION_PROGRAMS_STARTED', () => {
    const action = { type: FETCH_INSTITUTION_PROGRAMS_STARTED };
    const expectedState = { ...initialState, loading: true, error: null };

    const result = institutionProgramsReducer(initialState, action);
    expect(result).to.eql(expectedState);
  });

  it('should handle FETCH_INSTITUTION_PROGRAMS_FAILED', () => {
    const errorMessage = 'Network error';
    const action = {
      type: FETCH_INSTITUTION_PROGRAMS_FAILED,
      payload: errorMessage,
    };
    const expectedState = {
      ...initialState,
      loading: false,
      error: errorMessage,
    };

    const result = institutionProgramsReducer(initialState, action);
    expect(result).to.eql(expectedState);
  });

  it('should handle FETCH_INSTITUTION_PROGRAMS_SUCCEEDED', () => {
    const mockData = [
      { id: 1, name: 'Program 1' },
      { id: 2, name: 'Program 2' },
    ];
    const action = {
      type: FETCH_INSTITUTION_PROGRAMS_SUCCEEDED,
      payload: mockData,
    };
    const expectedState = {
      ...initialState,
      loading: false,
      institutionPrograms: mockData,
      error: null,
    };

    const result = institutionProgramsReducer(initialState, action);
    expect(result).to.eql(expectedState);
  });
});
