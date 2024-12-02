import { expect } from 'chai';
import {
  SEARCH_FAILED,
  FETCH_REPRESENTATIVES,
  CLEAR_ERROR,
  REPORT_COMPLETE,
  GEOCODE_FAILED,
  REPORT_FAILED,
  GEOCODE_STARTED,
  SEARCH_COMPLETE,
  SEARCH_STARTED,
} from '../../utils/actionTypes';
import { ErrorsReducer, INITIAL_STATE } from '../../reducers/errors';

describe('errors reducer', () => {
  it('should handle fetching list of representatives', () => {
    const state = ErrorsReducer(
      {
        ...INITIAL_STATE,
        isErrorFetchRepresentatives: true,
      },
      {
        type: FETCH_REPRESENTATIVES,
      },
    );

    expect(state.isErrorFetchRepresentatives).to.eql(null);
  });

  it('should handle report complete', () => {
    const state = ErrorsReducer(
      {
        ...INITIAL_STATE,
      },
      {
        type: REPORT_COMPLETE,
      },
    );

    expect(state.isErrorFetchRepresentatives).to.eql(null);
  });

  it('should handle geocode failure', () => {
    const state = ErrorsReducer(
      {
        ...INITIAL_STATE,
      },
      {
        type: GEOCODE_FAILED,
        code: '123',
      },
    );

    expect(state.isErrorGeocode).to.eql('123');
  });

  it('should handle search failure', () => {
    const state = ErrorsReducer(
      {
        ...INITIAL_STATE,
      },
      {
        type: SEARCH_FAILED,
        error: 404,
      },
    );

    expect(state.isErrorFetchRepresentatives).to.eql(404);
  });
  it('should handle error clearing', () => {
    const state = ErrorsReducer(
      {
        ...INITIAL_STATE,
        isErrorFetchRepresentatives: 404,
      },
      {
        type: CLEAR_ERROR,
        payload: { errorType: 'isErrorFetchRepresentatives' },
      },
    );

    expect(state.isErrorFetchRepresentatives).to.eql(null);
  });
  it('should handle report failure', () => {
    const state = ErrorsReducer(
      {
        ...INITIAL_STATE,
      },
      {
        type: REPORT_FAILED,
      },
    );

    expect(state.isErrorReportSubmission).to.eql(true);
  });
  it('should clear error on starting geocode', () => {
    const state = ErrorsReducer(
      {
        ...INITIAL_STATE,
        isErrorFetchRepresentatives: true,
      },
      {
        type: GEOCODE_STARTED,
      },
    );

    expect(state.isErrorFetchRepresentatives).to.eql(null);
  });
  it('should clear error on search complete', () => {
    const state = ErrorsReducer(
      {
        ...INITIAL_STATE,
        isErrorFetchRepresentatives: true,
      },
      {
        type: SEARCH_COMPLETE,
      },
    );

    expect(state.isErrorFetchRepresentatives).to.eql(null);
  });
  it('should clear error on search started', () => {
    const state = ErrorsReducer(
      {
        ...INITIAL_STATE,
        isErrorFetchRepresentatives: true,
      },
      {
        type: SEARCH_STARTED,
      },
    );

    expect(state.isErrorFetchRepresentatives).to.eql(null);
  });
});
