import { expect } from 'chai';
import {
  // SEARCH_FAILED,
  SEARCH_QUERY_UPDATED,
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

  //   it('should handle search failed', () => {
  //     const state = ErrorsReducer(
  //       {
  //         ...INITIAL_STATE,
  //         isErrorFetchRepresentatives: null,
  //       },
  //       {
  //         type: SEARCH_FAILED,
  //       },
  //     );

  //     expect(state.isErrorFetchRepresentatives).to.eql(true);
  //   });

  it('should handle search query updated', () => {
    const state = ErrorsReducer(
      {
        ...INITIAL_STATE,
        isErrorFetchRepresentatives: true,
      },
      {
        type: SEARCH_QUERY_UPDATED,
        payload: {
          attribute: true,
        },
      },
    );

    expect(state.isErrorFetchRepresentatives).to.eql(null);
  });
});
