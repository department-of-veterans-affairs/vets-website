import { expect } from 'chai';
import licenseCertificationSearchReducer, {
  INITIAL_STATE,
} from '../../reducers/licenseCertificationSearch';
import {
  FETCH_LC_RESULTS_STARTED,
  FETCH_LC_RESULTS_SUCCEEDED,
  FETCH_LC_RESULTS_FAILED,
  FETCH_LC_RESULT_STARTED,
  FETCH_LC_RESULT_SUCCEEDED,
  FETCH_LC_RESULT_FAILED,
} from '../../actions';

describe('License Certification Reducer', () => {
  it('should handle FETCH_LC_RESULTS_STARTED', () => {
    const result = licenseCertificationSearchReducer(INITIAL_STATE, {
      type: FETCH_LC_RESULTS_STARTED,
    });
    expect(result).to.deep.equal({
      ...INITIAL_STATE,
      fetchingLc: true,
    });
  });

  it('should handle FETCH_LC_RESULTS_SUCCEEDED', () => {
    const payload = [{ id: 1, name: 'Test LC Result' }];
    const result = licenseCertificationSearchReducer(INITIAL_STATE, {
      type: FETCH_LC_RESULTS_SUCCEEDED,
      payload,
    });
    expect(result).to.deep.equal({
      ...INITIAL_STATE,
      filteredResults: payload,
      fetchingLc: false,
      lcResults: payload,
      hasFetchedOnce: true,
      error: false,
    });
  });

  it('should handle FETCH_LC_RESULTS_FAILED', () => {
    const payload = 'Failed to fetch LC results';
    const result = licenseCertificationSearchReducer(INITIAL_STATE, {
      type: FETCH_LC_RESULTS_FAILED,
      payload,
    });
    expect(result).to.deep.equal({
      ...INITIAL_STATE,
      fetchingLc: false,
      error: payload,
    });
  });

  it('should handle FETCH_LC_RESULT_STARTED', () => {
    const result = licenseCertificationSearchReducer(INITIAL_STATE, {
      type: FETCH_LC_RESULT_STARTED,
    });
    expect(result).to.deep.equal({
      ...INITIAL_STATE,
      fetchingLcResult: true,
    });
  });

  it('should handle FETCH_LC_RESULT_SUCCEEDED', () => {
    const payload = { id: 1, details: 'Detailed LC result' };
    const result = licenseCertificationSearchReducer(INITIAL_STATE, {
      type: FETCH_LC_RESULT_SUCCEEDED,
      payload,
    });
    expect(result).to.deep.equal({
      ...INITIAL_STATE,
      fetchingLcResult: false,
      lcResultInfo: payload,
      hasFetchedResult: true,
    });
  });

  it('should handle FETCH_LC_RESULT_FAILED', () => {
    const payload = 'Failed to fetch LC result';
    const result = licenseCertificationSearchReducer(INITIAL_STATE, {
      type: FETCH_LC_RESULT_FAILED,
      payload,
    });
    expect(result).to.deep.equal({
      ...INITIAL_STATE,
      fetchingLcResult: false,
      error: payload,
    });
  });
});
