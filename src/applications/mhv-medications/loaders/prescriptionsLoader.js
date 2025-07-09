import { defer } from 'react-router-dom-v5-compat';
import { store } from '../store';
import {
  getPrescriptionById,
  getPrescriptionsList,
  getRefillablePrescriptions,
} from '../api/prescriptionsApi';
import {
  rxListSortingOptions,
  ALL_MEDICATIONS_FILTER_KEY,
  filterOptions,
} from '../util/constants';

/**
 * Builds query parameters for prescription list requests
 * @param {Object} preferences - The rx preferences from the store
 * @returns {Object} Query parameters object
 */
const buildQueryParams = preferences => {
  const { pageNumber, filterOption, sortOption } = preferences;

  // Get the sort endpoint from the sort option
  const sortEndpoint =
    sortOption && rxListSortingOptions[sortOption]?.API_ENDPOINT
      ? rxListSortingOptions[sortOption].API_ENDPOINT
      : rxListSortingOptions[Object.keys(rxListSortingOptions)[0]].API_ENDPOINT;

  // Determine filter option URL
  const filterOptionUrl =
    filterOption !== ALL_MEDICATIONS_FILTER_KEY &&
    filterOptions[filterOption]?.url
      ? filterOptions[filterOption].url
      : '';

  return {
    page: pageNumber || 1,
    perPage: 10,
    sortEndpoint,
    filterOption: filterOptionUrl,
  };
};

/**
 * Route loader for prescriptions
 * Loads prescription data when routes that need it are accessed
 *
 * N.B.: The order of the fetch promises is important, because
 *       browsers will only make 6-8 concurrent requests and the
 *       platform code is already fetching feature toggles,
 *       user profile, maintenance windows, etc.
 */
export const prescriptionsLoader = ({ params }) => {
  const fetchPromises = [];
  const rxId = params?.prescriptionId || null;

  // For refill pages, load refillable prescriptions
  if (window.location.pathname.endsWith('/refill')) {
    fetchPromises.push(store.dispatch(getRefillablePrescriptions.initiate()));
  } else if (!rxId) {
    const state = store.getState();
    const prefs = buildQueryParams(state.rx.preferences);
    fetchPromises.push(store.dispatch(getPrescriptionsList.initiate(prefs)));
  } else if (rxId) {
    // If on a prescription detail page, fetch that specific prescription
    fetchPromises.push(store.dispatch(getPrescriptionById.initiate(rxId)));
  }

  return defer(Promise.all(fetchPromises));
};
