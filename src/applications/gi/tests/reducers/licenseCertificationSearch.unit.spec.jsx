import { expect } from 'chai';
import sinon from 'sinon';
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
  FILTER_LC_RESULTS,
} from '../../actions';
import * as helpers from '../../utils/helpers';

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
  it('should handle FILTER_LC_RESULTS, removing duplicates and sorting by lacNm', () => {
    // 1) Stub filterSuggestions so we fully control the "newSuggestions" + "previousMatches"
    const filterSuggestionsStub = sinon.stub(helpers, 'filterSuggestions');

    filterSuggestionsStub.onFirstCall().returns([
      { enrichedId: '111', lacNm: 'Alpha' },
      { enrichedId: '222', lacNm: 'Beta' },
      { enrichedId: '333', lacNm: 'Charlie' },
    ]);

    // The second call returns the "previousMatches"
    filterSuggestionsStub
      .onSecondCall()
      .returns([{ enrichedId: '222', lacNm: 'Beta' }]);

    const customInitialState = {
      ...INITIAL_STATE,
      lcResults: [
        { enrichedId: '111', lacNm: 'Alpha' },
        { enrichedId: '222', lacNm: 'Beta' },
        { enrichedId: '333', lacNm: 'Charlie' },
      ],
    };

    const payload = {
      name: '',
      categories: [],
      location: '',
      previousResults: [{ enrichedId: '222', lacNm: 'Beta' }],
    };

    const nextState = licenseCertificationSearchReducer(customInitialState, {
      type: FILTER_LC_RESULTS,
      payload,
    });

    // Now we confirm that finalList is sorted and deduplicated:
    expect(nextState.filteredResults).to.deep.equal([
      { enrichedId: '111', lacNm: 'Alpha' },
      { enrichedId: '222', lacNm: 'Beta' },
      { enrichedId: '333', lacNm: 'Charlie' },
    ]);

    filterSuggestionsStub.restore();
  });
});
