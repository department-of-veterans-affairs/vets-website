import { expect } from 'chai';
import {
  // SEARCH_FAILED,
  FETCH_REPRESENTATIVES,
  // GEOCODE_FAILED,
  // CLEAR_GEOCODE_ERROR,
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
});
