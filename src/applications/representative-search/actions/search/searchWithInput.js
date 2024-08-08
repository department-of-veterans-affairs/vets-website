import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { SEARCH_STARTED } from '../../utils/actionTypes';
import { fetchRepresentatives } from '../representatives/fetchRepresentatives';

/**
 * @param {{address: string, lat: number, long: number, name: string, page: number, per_page: number, sort: string}}
 */

export const searchWithInput = ({
  address,
  lat,
  long,
  name,
  page,
  perPage,
  sort,
  type,
  distance,
}) => {
  return dispatch => {
    dispatch({
      type: SEARCH_STARTED,
      payload: {
        currentPage: page,
        searchWithInputInProgress: true,
      },
    });

    recordEvent({
      // prettier-ignore
      'event': 'far-search',
      'search-filters-list': {
        'Type of accredited representative': type,
        'Search area': distance,
        'Name of accredited representative': name,
      },
      'search-selection': 'Find VA Accredited Rep',
    });

    fetchRepresentatives(
      address,
      lat,
      long,
      name,
      page,
      perPage,
      sort,
      type,
      distance,
      dispatch,
    );
  };
};
