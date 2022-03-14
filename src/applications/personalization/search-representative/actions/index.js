export const FETCH_REPRESENTATIVE_SEARCH_RESULTS_FAILED =
  'FETCH_REPRESENTATIVE_SEARCH_RESULTS_FAILED';
export const FETCH_REPRESENTATIVE_SEARCH_RESULTS_SUCCESS =
  'FETCH_REPRESENTATIVE_SEARCH_RESULTS_SUCCESS';

function mockSearchResults() {
  return {
    data: [
      {
        id: 12345,
        name: 'Veterans of Foreign Wars (033)',
        type: 'Veteran Service Organization (VSO)',
        address: 'PO Box 1509',
        city: 'Montgomery',
        state: 'Alabama',
        postalCode: '36102-1509',
        phone: '205-932-6262',
      },
      {
        id: 992,
        name: 'Disabled American Veteras (999)',
        type: 'Attourney',
        address: 'PO Box 1509',
        city: 'Montgomery',
        state: 'Alabama',
        postalCode: '36102-1509',
        phone: '205-932-6262',
      },
      {
        id: 4325,
        name: 'Charles K. Polk (123)',
        type: 'Attorney',
        address: 'PO Box 1509',
        city: 'Montgomery',
        state: 'Alabama',
        postalCode: '36102-1509',
        phone: '205-932-6262',
      },
      {
        id: 12366,
        name: 'My Happy Place (999)',
        type: 'Veteran Service Organization (VSO)',
        address: 'PO Box 1509',
        city: 'Montgomery',
        state: 'Alabama',
        postalCode: '36102-1509',
        phone: '205-932-6262',
      },
      {
        id: 9929342,
        name: 'Disabled American Veteras (999)',
        type: 'Attourney',
        address: 'PO Box 1509',
        city: 'Montgomery',
        state: 'Alabama',
        postalCode: '36102-1509',
        phone: '205-932-6262',
      },
      {
        id: 4325241,
        name: 'Bill Bob (123)',
        type: 'Attorney',
        address: 'PO Box 1509',
        city: 'Montgomery',
        state: 'Alabama',
        postalCode: '36102-1509',
        phone: '205-932-6262',
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
