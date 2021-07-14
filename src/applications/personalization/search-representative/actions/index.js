export const FETCH_REPRESENTATIVE_SEARCH_RESULTS_FAILED =
  'FETCH_REPRESENTATIVE_SEARCH_RESULTS_FAILED';
export const FETCH_REPRESENTATIVE_SEARCH_RESULTS_SUCCESS =
  'FETCH_REPRESENTATIVE_SEARCH_RESULTS_SUCCESS';

function mockSearchResults() {
  return {
    data: [
      {
        id: 12345,
        name: 'My place',
        city: 'Someplace',
        state: 'California',
      },
      {
        id: 4325,
        name: 'Another place',
        city: 'Another place',
        state: 'Arizona',
      },
    ],
  };
}

export function fetchRepresentativeSearchResults() {
  return async dispatch => {
    const response = await mockSearchResults();

    if (response) {
      dispatch({
        type: FETCH_REPRESENTATIVE_SEARCH_RESULTS_SUCCESS,
        response,
      });
    } else {
      dispatch({
        type: FETCH_REPRESENTATIVE_SEARCH_RESULTS_FAILED,
        response,
      });
    }
  };
}
