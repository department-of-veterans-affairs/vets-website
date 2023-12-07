import * as Sentry from '@sentry/browser';
import {
  // FETCH_REPRESENTATIVES,
  SEARCH_FAILED,
  SEARCH_COMPLETE,
} from '../../utils/actionTypes';
import { useMockData } from '../../config';
// import mockPaginatedData from '../../constants/mock-representative-paginated-data.json';
import mockUnpaginatedData from '../../constants/mock-rep-data-unpaginated.json';
import { mockPaginatedResponse } from '../../utils/helpers';

import RepresentativeFinderApi from '../../api/RepresentativeFinderApi';
/**
 * Handles the API call to get the type of locations closest to `address`
 * and/or within the given `bounds`.
 *
 * @param {string=} address Address of the center-point of the search area
 * @param {number[]} bounds Geo-coords of the bounding box of the search area
 * @param {string} representativeType (see config.js for valid types)
 * @param {number} page What page of results to request
 * @param {Function} dispatch Redux's dispatch method
 * @param {number} api version number
 */
export const fetchRepresentatives = async (
  address,
  lat,
  long,
  name,
  page,
  /* eslint-disable camelcase */
  per_page,
  sort,
  type,
  dispatch,
) => {
  try {
    const dataList = await RepresentativeFinderApi.searchByCoordinates(
      address,
      lat,
      long,
      name,
      page,
      per_page,
      sort,
      type,
    );
    if (dataList.data) {
      dispatch({ type: SEARCH_COMPLETE, payload: dataList });
    }

    if (dataList.errors?.length > 0) {
      dispatch({ type: SEARCH_FAILED, error: dataList.errors });
    }
  } catch (error) {
    if (useMockData) {
      /*
      const mockedResponse = {
        data: mockPaginatedData.mockPages[page - 1],
        links: mockPaginatedData.links,
        meta: {
          ...mockPaginatedData.meta,
          pagination: {
            ...mockPaginatedData.meta.pagination,
            currentPage: page,
          },
        },
      };
      */

      const mockedResponse = mockPaginatedResponse(mockUnpaginatedData, page);
      dispatch({ type: SEARCH_COMPLETE, payload: mockedResponse });

      return;
    }
    Sentry.withScope(scope => {
      scope.setExtra('error', error);
      Sentry.captureMessage('Error fetching accredited representatives');
    });

    dispatch({ type: SEARCH_FAILED, error: error.message });
    throw error;
  }
};
