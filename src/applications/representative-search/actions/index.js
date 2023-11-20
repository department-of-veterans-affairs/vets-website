import { clearGeocodeError } from './mapbox/clearGeocodeError';
import { clearSearchResults } from './search/clearSearchResults';
import { clearSearchText } from './search/clearSearchText';
import { fetchRepresentatives } from './representatives/fetchRepresentatives';
import { genSearchAreaFromCenter } from './mapbox/genSearchAreaFromCenter';
import { geolocateUser } from './mapbox/geoLocateUser';
import { geocodeUserAddress } from './mapbox/geocodeUserAddress';
import { searchWithInput } from './search/searchWithInput';
import { updateSearchQuery } from './search/updateSearchQuery';
import { updateSortType } from './search/updateSortType';

export { clearGeocodeError };
export { clearSearchResults };
export { clearSearchText };
export { fetchRepresentatives };
export { genSearchAreaFromCenter };
export { geolocateUser };
export { geocodeUserAddress };
export { searchWithInput };
export { updateSearchQuery };
export { updateSortType };

export const FETCH_REPRESENTATIVE_SEARCH_RESULTS_FAILED =
  'FETCH_REPRESENTATIVE_SEARCH_RESULTS_FAILED';
export const FETCH_REPRESENTATIVE_SEARCH_RESULTS_SUCCESS =
  'FETCH_REPRESENTATIVE_SEARCH_RESULTS_SUCCESS';

function mockSearchResults() {
  return {
    data: [
      {
        distance: 1.25,
        organization: 'Catholic War Veterans of the USA (081)',
        type: 'VSO',
        addressLine1: '237-20 92nd Road',
        addressLine2: 'Bellerose, NY 11426',
        phone: '(702) 684-2997',
      },
      {
        distance: 1.55,
        organization: 'Polish Legion of American Veterans (003)',
        type: 'VSO',
        addressLine1: '237-20 92nd Road',
        addressLine2: 'Bellerose, NY 11426',
        phone: '(703) 549-3622',
      },
      {
        distance: 1.65,
        organization:
          'National Association of County Veterans Service Of (064)',
        type: 'VSO',
        addressLine1: 'Union County Services',
        addressLine2: 'Elizabeth, NJ 07207',
        phone: '(856) 780-1380',
      },
      {
        distance: 1.75,
        organization: 'Jewish War Veterans of the USA (086)',
        type: 'VSO',
        addressLine1: '237-20 92nd Road',
        addressLine2: 'Bellerose, NY 11426',
        phone: '(377) 777-8157',
      },
      {
        distance: 2.05,
        organization: 'Vietnam Veterans of America (070)',
        type: 'VSO',
        addressLine1: '616 E. Landis Ave.',
        addressLine2: 'Vineland, NJ 08360',
        phone: '(856) 293-7321',
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
