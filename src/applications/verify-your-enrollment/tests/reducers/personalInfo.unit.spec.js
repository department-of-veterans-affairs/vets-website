import { expect } from 'chai';
import personalInfo from '../../reducers/personalInfo';
import {
  FETCH_PERSONAL_INFO,
  FETCH_PERSONAL_INFO_SUCCESS,
  FETCH_PERSONAL_INFO_FAILED,
} from '../../actions';

describe('personalInfo Reducer', () => {
  it('should return initial State', () => {
    expect(personalInfo(undefined, {})).to.deep.equal({
      personalInfo: null,
      isLoading: false,
      error: null,
    });
  });
  it('should handles FETCH_PERSONAL_INFO', () => {
    expect(
      personalInfo(undefined, { type: FETCH_PERSONAL_INFO }),
    ).to.deep.equal({
      personalInfo: null,
      isLoading: true,
      error: null,
    });
  });
  it('should FETCH_PERSONAL_INFO_SUCCESS', () => {
    const response = { data: 'some test data' };
    expect(
      personalInfo(undefined, { type: FETCH_PERSONAL_INFO_SUCCESS, response }),
    ).to.deep.equal({
      personalInfo: response,
      isLoading: false,
      error: null,
    });
  });
  it('should FETCH_PERSONAL_INFO_FAILED', () => {
    const errors = { message: 'some error message' };
    expect(
      personalInfo(undefined, { type: FETCH_PERSONAL_INFO_FAILED, errors }),
    ).to.deep.equal({
      personalInfo: null,
      isLoading: false,
      error: errors,
    });
  });
});
