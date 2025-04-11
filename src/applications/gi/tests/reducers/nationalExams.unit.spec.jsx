import { expect } from 'chai';
import nationalExamsReducer from '../../reducers/nationalExams';
import {
  FETCH_NATIONAL_EXAMS_STARTED,
  FETCH_NATIONAL_EXAMS_FAILED,
  FETCH_NATIONAL_EXAMS_SUCCEEDED,
  FETCH_NATIONAL_EXAM_DETAILS_STARTED,
  FETCH_NATIONAL_EXAM_DETAILS_FAILED,
  FETCH_NATIONAL_EXAM_DETAILS_SUCCEEDED,
} from '../../actions';

describe('nationalExamsReducer', () => {
  const initialState = {
    nationalExams: [],
    examDetails: null,
    loading: false,
    loadingDetails: false,
    error: null,
  };

  it('should return the initial state by default', () => {
    const result = nationalExamsReducer(undefined, {});
    expect(result).to.eql(initialState);
  });

  it('should handle FETCH_NATIONAL_EXAMS_STARTED', () => {
    const action = { type: FETCH_NATIONAL_EXAMS_STARTED };
    const expectedState = { ...initialState, loading: true, error: null };

    const result = nationalExamsReducer(initialState, action);
    expect(result).to.eql(expectedState);
  });

  it('should handle FETCH_NATIONAL_EXAMS_FAILED', () => {
    const errorMessage = 'Network error';
    const action = {
      type: FETCH_NATIONAL_EXAMS_FAILED,
      payload: errorMessage,
    };
    const expectedState = {
      ...initialState,
      loading: false,
      error: errorMessage,
    };

    const result = nationalExamsReducer(initialState, action);
    expect(result).to.eql(expectedState);
  });

  it('should handle FETCH_NATIONAL_EXAMS_SUCCEEDED', () => {
    const mockData = [
      { id: 1, name: 'Exam 1' },
      { id: 2, name: 'Exam 2' },
    ];
    const action = {
      type: FETCH_NATIONAL_EXAMS_SUCCEEDED,
      payload: mockData,
    };
    const expectedState = {
      ...initialState,
      loading: false,
      nationalExams: mockData,
      error: null,
    };

    const result = nationalExamsReducer(initialState, action);
    expect(result).to.eql(expectedState);
  });
  it('should handle FETCH_NATIONAL_EXAM_DETAILS_STARTED', () => {
    const action = { type: FETCH_NATIONAL_EXAM_DETAILS_STARTED };
    const expectedState = {
      ...initialState,
      loadingDetails: true,
      error: null,
    };

    const result = nationalExamsReducer(initialState, action);
    expect(result).to.eql(expectedState);
  });

  it('should handle FETCH_NATIONAL_EXAM_DETAILS_FAILED', () => {
    const errorMessage = 'Something went wrong';
    const action = {
      type: FETCH_NATIONAL_EXAM_DETAILS_FAILED,
      payload: errorMessage,
    };
    const expectedState = {
      ...initialState,
      loadingDetails: false,
      error: errorMessage,
    };

    const result = nationalExamsReducer(initialState, action);
    expect(result).to.eql(expectedState);
  });

  it('should handle FETCH_NATIONAL_EXAM_DETAILS_SUCCEEDED', () => {
    const mockExamDetails = {
      enrichedId: '6@a4d71',
      name: 'GRE-GRADUATE RECORD EXAM',
    };
    const action = {
      type: FETCH_NATIONAL_EXAM_DETAILS_SUCCEEDED,
      payload: mockExamDetails,
    };
    const expectedState = {
      ...initialState,
      loadingDetails: false,
      examDetails: mockExamDetails,
      error: null,
    };

    const result = nationalExamsReducer(initialState, action);
    expect(result).to.eql(expectedState);
  });
});
